import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Subject } from "./entity/subject.entity";
import { Repository } from "typeorm";
import { CreateSubjectDto, FilterSubjectDto, UpdateSubjectDto } from "./dto";
import { SubjectOrderBy } from "./enum/sort.enum";


@Injectable()
export class SubjectService {
    constructor(@InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>){}

    async create(createSubjectDto: CreateSubjectDto): Promise<Subject>{
        const { nombre, 
                matrícula,
                sección,
                descripción,
                inicio_de_matrícula,
                fin_de_matrícula,
                fecha_de_inicio,
                fecha_de_fin,
                estado,
                categoría } = createSubjectDto;

        const newSubject = this.subjectRepository.create({
              nombre, 
              matrícula,
              sección,
              descripción,
              inicio_de_matrícula,
              fin_de_matrícula,
              fecha_de_inicio,
              fecha_de_fin,
              estado,
              categoría
        });

        return this.subjectRepository.save(newSubject);
    }

    async findAll(filterDto: FilterSubjectDto) {
        const {
        nombre,
        estado,
        sección,
        categoria,
        matriculaMin,
        matriculaMax,
        fechaInicioDesde,
        fechaInicioHasta,
        fechaFinDesde,
        fechaFinHasta,
        inicioMatriculaDesde,
        inicioMatriculaHasta,
        finMatriculaDesde,
        finMatriculaHasta,
        orderBy,
        page = 1,
        limit = 20, 
        } = filterDto;

        const query = this.subjectRepository.createQueryBuilder('subject');

        // Filtros por nombre (búsqueda parcial)
        if (nombre) {
        query.andWhere('subject.nombre LIKE :nombre', { nombre: `%${nombre}%` });
        }

        // Filtros por enum
        if (estado) {
        query.andWhere('subject.estado = :estado', { estado });
        }

        if (sección) {
        query.andWhere('subject.sección = :sección', { sección });
        }

        if (categoria) {
        query.andWhere('subject.categoría = :categoria', { categoria });
        }

        // Filtros por rango de matrícula
        if (matriculaMin !== undefined) {
        query.andWhere('subject.matrícula >= :matriculaMin', { matriculaMin });
        }

        if (matriculaMax !== undefined) {
        query.andWhere('subject.matrícula <= :matriculaMax', { matriculaMax });
        }

        // Filtros por fecha de inicio de asignatura
        if (fechaInicioDesde) {
        query.andWhere('subject.fecha_de_inicio >= :fechaInicioDesde', { 
            fechaInicioDesde: new Date(fechaInicioDesde) 
        });
        }

        if (fechaInicioHasta) {
        query.andWhere('subject.fecha_de_inicio <= :fechaInicioHasta', { 
            fechaInicioHasta: new Date(fechaInicioHasta) 
        });
        }

        // Filtros por fecha de fin de asignatura
        if (fechaFinDesde) {
        query.andWhere('subject.fecha_de_fin >= :fechaFinDesde', { 
            fechaFinDesde: new Date(fechaFinDesde) 
        });
        }

        if (fechaFinHasta) {
        query.andWhere('subject.fecha_de_fin <= :fechaFinHasta', { 
            fechaFinHasta: new Date(fechaFinHasta) 
        });
        }

        // Filtros por fechas de matrícula
        if (inicioMatriculaDesde) {
        query.andWhere('subject.inicio_de_matrícula >= :inicioMatriculaDesde', { 
            inicioMatriculaDesde: new Date(inicioMatriculaDesde) 
        });
        }

        if (inicioMatriculaHasta) {
        query.andWhere('subject.inicio_de_matrícula <= :inicioMatriculaHasta', { 
            inicioMatriculaHasta: new Date(inicioMatriculaHasta) 
        });
        }

        if (finMatriculaDesde) {
        query.andWhere('subject.fin_de_matrícula >= :finMatriculaDesde', { 
            finMatriculaDesde: new Date(finMatriculaDesde) 
        });
        }

        if (finMatriculaHasta) {
        query.andWhere('subject.fin_de_matrícula <= :finMatriculaHasta', { 
            finMatriculaHasta: new Date(finMatriculaHasta) 
        });
        }

        // Ordenamiento
        if (orderBy) {
        this.applyOrderBy(query, orderBy);
        } else {
        query.orderBy('subject.nombre', 'ASC');
        }

        // Paginación
        const skip = (page - 1) * limit;
        query.skip(skip).take(limit);

        const [subjects, total] = await query.getManyAndCount();

        return {
        data: subjects,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
        };
    }

    private applyOrderBy(query: any, orderBy: SubjectOrderBy) {
        switch (orderBy) {
        case SubjectOrderBy.NOMBRE_ASC:
            query.orderBy('subject.nombre', 'ASC');
            break;
        case SubjectOrderBy.NOMBRE_DESC:
            query.orderBy('subject.nombre', 'DESC');
            break;
        case SubjectOrderBy.MATRICULA_ASC:
            query.orderBy('subject.matrícula', 'ASC');
            break;
        case SubjectOrderBy.MATRICULA_DESC:
            query.orderBy('subject.matrícula', 'DESC');
            break;
        case SubjectOrderBy.INICIO_MATRICULA_ASC:
            query.orderBy('subject.inicio_de_matrícula', 'ASC');
            break;
        case SubjectOrderBy.INICIO_MATRICULA_DESC:
            query.orderBy('subject.inicio_de_matrícula', 'DESC');
            break;
        case SubjectOrderBy.FIN_MATRICULA_ASC:
            query.orderBy('subject.fin_de_matrícula', 'ASC');
            break;
        case SubjectOrderBy.FIN_MATRICULA_DESC:
            query.orderBy('subject.fin_de_matrícula', 'DESC');
            break;
        case SubjectOrderBy.INICIO_ASIGNATURA_ASC:
            query.orderBy('subject.fecha_de_inicio', 'ASC');
            break;
        case SubjectOrderBy.INICIO_ASIGNATURA_DESC:
            query.orderBy('subject.fecha_de_inicio', 'DESC');
            break;
        case SubjectOrderBy.FIN_ASIGNATURA_ASC:
            query.orderBy('subject.fecha_de_fin', 'ASC');
            break;
        case SubjectOrderBy.FIN_ASIGNATURA_DESC:
            query.orderBy('subject.fecha_de_fin', 'DESC');
            break;
        default:
            query.orderBy('subject.nombre', 'ASC');
        }
    }

    async findOne(id: string): Promise<Subject>{
        const subject = await this.subjectRepository.findOne({where: {id}})
        if (!subject) throw new NotFoundException('Asignatura no encontrada');
        return subject;
    }
    
    async update(id: string, dto: UpdateSubjectDto): Promise<Subject>{
        const subject = await this.findOne(id);

        Object.assign(subject, dto);
        return this.subjectRepository.save(subject);
    }
}