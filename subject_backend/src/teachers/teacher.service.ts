import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Teacher } from "./entity/teacher.entity";
import { CreateTeacherDto, FilterTeacherDto, UpdateTeacherDto } from "./dto";
import { TeacherOrderBy } from "./enum/sort";

@Injectable()
export class TeacherService {
    constructor(
        @InjectRepository(Teacher)
        private readonly teacherRepository: Repository<Teacher>
    ) {}

    async create(createTeacherDto: CreateTeacherDto): Promise<Teacher> {
        const {
            nombre,
            apellido,
            email,
            telefono,
            documento_identidad,
            fecha_contratacion,
            fecha_terminacion,
            titulos_academicos,
            años_experiencia,
            direccion,
            fecha_nacimiento,
            nacionalidad,
            foto_url
        } = createTeacherDto;

        const newTeacher = this.teacherRepository.create({
            nombre,
            apellido,
            email,
            telefono,
            documento_identidad,
            fecha_contratacion,
            fecha_terminacion,
            titulos_academicos,
            años_experiencia,
            direccion,
            fecha_nacimiento,
            nacionalidad,
            foto_url
        });

        return this.teacherRepository.save(newTeacher);
    }

    async findAll(filterDto: FilterTeacherDto) {
        const {
            nombre,
            apellido,
            email,
            añosExperienciaMin,
            añosExperienciaMax,
            fechaContratacionDesde,
            fechaContratacionHasta,
            fechaNacimientoDesde,
            fechaNacimientoHasta,
            nacionalidad,
            orderBy,
            page = 1,
            limit = 20,
        } = filterDto;

        const query = this.teacherRepository.createQueryBuilder('teachers');

        // Filtros por texto (búsqueda parcial)
        if (nombre) {
            query.andWhere('teachers.nombre LIKE :nombre', { nombre: `%${nombre}%` });
        }

        if (apellido) {
            query.andWhere('teachers.apellido LIKE :apellido', { apellido: `%${apellido}%` });
        }

        if (email) {
            query.andWhere('teachers.email LIKE :email', { email: `%${email}%` });
        }

        if (nacionalidad) {
            query.andWhere('teachers.nacionalidad = :nacionalidad', { nacionalidad });
        }

        // Filtros por rango de años de experiencia
        if (añosExperienciaMin !== undefined) {
            query.andWhere('teachers.años_experiencia >= :añosExperienciaMin', { añosExperienciaMin });
        }

        if (añosExperienciaMax !== undefined) {
            query.andWhere('teachers.años_experiencia <= :añosExperienciaMax', { añosExperienciaMax });
        }

        // Filtros por fecha de contratación
        if (fechaContratacionDesde) {
            query.andWhere('teachers.fecha_contratacion >= :fechaContratacionDesde', {
                fechaContratacionDesde: new Date(fechaContratacionDesde)
            });
        }

        if (fechaContratacionHasta) {
            query.andWhere('teachers.fecha_contratacion <= :fechaContratacionHasta', {
                fechaContratacionHasta: new Date(fechaContratacionHasta)
            });
        }

        // Filtros por fecha de nacimiento
        if (fechaNacimientoDesde) {
            query.andWhere('teachers.fecha_nacimiento >= :fechaNacimientoDesde', {
                fechaNacimientoDesde: new Date(fechaNacimientoDesde)
            });
        }

        if (fechaNacimientoHasta) {
            query.andWhere('teachers.fecha_nacimiento <= :fechaNacimientoHasta', {
                fechaNacimientoHasta: new Date(fechaNacimientoHasta)
            });
        }

        // Ordenamiento
        if (orderBy) {
            this.applyOrderBy(query, orderBy);
        } else {
            query.orderBy('teachers.apellido', 'ASC').addOrderBy('teachers.nombre', 'ASC');
        }

        // Paginación
        const skip = (page - 1) * limit;
        query.skip(skip).take(limit);

        const [teachers, total] = await query.getManyAndCount();

        return {
            data: teachers,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    private applyOrderBy(query: any, orderBy: TeacherOrderBy) {
        switch (orderBy) {
            case TeacherOrderBy.NOMBRE_ASC:
                query.orderBy('teachers.nombre', 'ASC');
                break;
            case TeacherOrderBy.NOMBRE_DESC:
                query.orderBy('teachers.nombre', 'DESC');
                break;
            case TeacherOrderBy.APELLIDO_ASC:
                query.orderBy('teachers.apellido', 'ASC');
                break;
            case TeacherOrderBy.APELLIDO_DESC:
                query.orderBy('teachers.apellido', 'DESC');
                break;
            case TeacherOrderBy.EMAIL_ASC:
                query.orderBy('teachers.email', 'ASC');
                break;
            case TeacherOrderBy.EMAIL_DESC:
                query.orderBy('teachers.email', 'DESC');
                break;
            case TeacherOrderBy.EXPERIENCIA_ASC:
                query.orderBy('teachers.años_experiencia', 'ASC');
                break;
            case TeacherOrderBy.EXPERIENCIA_DESC:
                query.orderBy('teachers.años_experiencia', 'DESC');
                break;
            case TeacherOrderBy.CONTRATACION_ASC:
                query.orderBy('teachers.fecha_contratacion', 'ASC');
                break;
            case TeacherOrderBy.CONTRATACION_DESC:
                query.orderBy('teachers.fecha_contratacion', 'DESC');
                break;
            case TeacherOrderBy.NACIMIENTO_ASC:
                query.orderBy('teachers.fecha_nacimiento', 'ASC');
                break;
            case TeacherOrderBy.NACIMIENTO_DESC:
                query.orderBy('teachers.fecha_nacimiento', 'DESC');
                break;
            default:
                query.orderBy('teachers.apellido', 'ASC').addOrderBy('teachers.nombre', 'ASC');
        }
    }

    async findOne(id: string): Promise<Teacher> {
        const teacher = await this.teacherRepository.findOne({ where: { id } });
        if (!teacher) throw new NotFoundException('Profesor no encontrado');
        return teacher;
    }

    async update(id: string, dto: UpdateTeacherDto): Promise<Teacher> {
        const teacher = await this.findOne(id);

        Object.assign(teacher, dto);
        return this.teacherRepository.save(teacher);
    }

    async remove(id: string): Promise<void> {
        const teacher = await this.findOne(id);
        await this.teacherRepository.remove(teacher);
    }
}