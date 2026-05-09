import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Student } from "./entity/student.entity";
import { CreateStudentDto, FilterStudentDto, UpdateStudentDto } from "./dto";
import { StudentOrderBy } from "./enum/sort";

@Injectable()
export class StudentService {
    constructor(
        @InjectRepository(Student)
        private readonly studentRepository: Repository<Student>
    ) {}

    async create(createStudentDto: CreateStudentDto): Promise<Student> {
        const {
            nombre,
            apellidos,
            facultad,
            año_academico,
            grupo_docente,
            estado,
            avales
        } = createStudentDto;

        const newStudent = this.studentRepository.create({
            nombre,
            apellidos,
            facultad,
            año_academico,
            grupo_docente,
            estado: estado || 'activo', // valor por defecto
            avales
        });

        return this.studentRepository.save(newStudent);
    }

    async findAll(filterDto: FilterStudentDto) {
        const {
            nombre,
            apellidos,
            facultad,
            añoAcademicoMin,
            añoAcademicoMax,
            grupoDocente,
            estado,
            avales,
            orderBy,
            page = 1,
            limit = 20,
        } = filterDto;

        const query = this.studentRepository.createQueryBuilder('students');

        // Filtros por texto (búsqueda parcial)
        if (nombre) {
            query.andWhere('students.nombre LIKE :nombre', { nombre: `%${nombre}%` });
        }

        if (apellidos) {
            query.andWhere('students.apellidos LIKE :apellidos', { apellidos: `%${apellidos}%` });
        }

        if (facultad) {
            query.andWhere('students.facultad LIKE :facultad', { facultad: `%${facultad}%` });
        }

        if (grupoDocente) {
            query.andWhere('students.grupo_docente LIKE :grupoDocente', { grupoDocente: `%${grupoDocente}%` });
        }

        if (estado) {
            query.andWhere('students.estado = :estado', { estado });
        }

        if (avales) {
            query.andWhere('students.avales LIKE :avales', { avales: `%${avales}%` });
        }

        // Filtros por rango de año académico
        if (añoAcademicoMin !== undefined) {
            query.andWhere('students.año_academico >= :añoAcademicoMin', { añoAcademicoMin });
        }

        if (añoAcademicoMax !== undefined) {
            query.andWhere('students.año_academico <= :añoAcademicoMax', { añoAcademicoMax });
        }

        // Ordenamiento
        if (orderBy) {
            this.applyOrderBy(query, orderBy);
        } else {
            query.orderBy('students.apellidos', 'ASC').addOrderBy('students.nombre', 'ASC');
        }

        // Paginación
        const skip = (page - 1) * limit;
        query.skip(skip).take(limit);

        const [students, total] = await query.getManyAndCount();

        return {
            data: students,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    private applyOrderBy(query: any, orderBy: StudentOrderBy) {
        switch (orderBy) {
            case StudentOrderBy.NOMBRE_ASC:
                query.orderBy('students.nombre', 'ASC');
                break;
            case StudentOrderBy.NOMBRE_DESC:
                query.orderBy('students.nombre', 'DESC');
                break;
            case StudentOrderBy.APELLIDOS_ASC:
                query.orderBy('students.apellidos', 'ASC');
                break;
            case StudentOrderBy.APELLIDOS_DESC:
                query.orderBy('students.apellidos', 'DESC');
                break;
            case StudentOrderBy.FACULTAD_ASC:
                query.orderBy('students.facultad', 'ASC');
                break;
            case StudentOrderBy.FACULTAD_DESC:
                query.orderBy('students.facultad', 'DESC');
                break;
            case StudentOrderBy.ANIO_ACADEMICO_ASC:
                query.orderBy('students.año_academico', 'ASC');
                break;
            case StudentOrderBy.ANIO_ACADEMICO_DESC:
                query.orderBy('students.año_academico', 'DESC');
                break;
            case StudentOrderBy.GRUPO_DOCENTE_ASC:
                query.orderBy('students.grupo_docente', 'ASC');
                break;
            case StudentOrderBy.GRUPO_DOCENTE_DESC:
                query.orderBy('students.grupo_docente', 'DESC');
                break;
            case StudentOrderBy.ESTADO_ASC:
                query.orderBy('students.estado', 'ASC');
                break;
            case StudentOrderBy.ESTADO_DESC:
                query.orderBy('students.estado', 'DESC');
                break;
            default:
                query.orderBy('students.apellidos', 'ASC').addOrderBy('students.nombre', 'ASC');
        }
    }

    async findOne(id: string): Promise<Student> {
        const student = await this.studentRepository.findOne({ where: { id } });
        if (!student) throw new NotFoundException('Estudiante no encontrado');
        return student;
    }

    async update(id: string, dto: UpdateStudentDto): Promise<Student> {
        const student = await this.findOne(id);

        Object.assign(student, dto);
        return this.studentRepository.save(student);
    }

    async remove(id: string): Promise<void> {
        const student = await this.findOne(id);
        await this.studentRepository.remove(student);
    }
}