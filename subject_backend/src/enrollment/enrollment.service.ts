import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not } from 'typeorm';
import { Enrollment } from './entity/enrollment.entity';
import { User } from '../users/entity/users.entity';
import { Subject } from '../subjects/entity/subject.entity';
import { CreateEnrollmentDto } from './dto';
import { UpdateEnrollmentDto } from './dto';
import { EstadoEnum } from '../subjects/enum/state.enum';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  /**
   * Crear una nueva inscripción
   */
  async create(createEnrollmentDto: CreateEnrollmentDto): Promise<Enrollment> {
    // Validar que el usuario existe
    const user = await this.userRepository.findOne({
      where: { id: createEnrollmentDto.userId }
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${createEnrollmentDto.userId} no encontrado`);
    }

    // Validar que la asignatura existe
    const subject = await this.subjectRepository.findOne({
      where: { id: createEnrollmentDto.subjectId }
    });

    if (!subject) {
      throw new NotFoundException(`Asignatura con ID ${createEnrollmentDto.subjectId} no encontrada`);
    }

    // Validar que la asignatura está disponible
    if (subject.estado !== EstadoEnum.DISPONIBLE) {
      throw new BadRequestException(`La asignatura "${subject.nombre}" no está disponible para inscripción. Estado: ${subject.estado}`);
    }

    // Validar que no exista ya una inscripción para este usuario en esta asignatura
    const existingEnrollment = await this.enrollmentRepository.findOne({
      where: {
        user: { id: user.id },
        subject: { id: subject.id }
      }
    });

    if (existingEnrollment) {
      throw new ConflictException(`El usuario ${user.name} ya está inscrito en la asignatura "${subject.nombre}"`);
    }

    // Crear la inscripción
    const enrollment = this.enrollmentRepository.create({
      user,
      subject
    });

    return await this.enrollmentRepository.save(enrollment);
  }

  /**
   * Crear múltiples inscripciones (bulk)
   */
  async createBulk(requests: Array<{ userId: string; subjectId: string }>): Promise<{
    created: Enrollment[];
    skipped: Array<{ request: any; reason: string }>;
  }> {
    const created: Enrollment[] = [];
    const skipped: Array<{ request: any; reason: string }> = [];

    // Agrupar IDs para consultas batch
    const userIds = [...new Set(requests.map(r => r.userId))];
    const subjectIds = [...new Set(requests.map(r => r.subjectId))];

    // Obtener todos los usuarios y asignaturas de una vez
    const users = await this.userRepository.find({
      where: { id: In(userIds) },
      select: ['id', 'name', 'email']
    });

    const subjects = await this.subjectRepository.find({
      where: { id: In(subjectIds) },
      select: ['id', 'nombre', 'estado']
    });

    // Crear mapas para acceso rápido
    const userMap = new Map(users.map(u => [u.id, u]));
    const subjectMap = new Map(subjects.map(s => [s.id, s]));

    // Procesar cada solicitud
    for (const request of requests) {
      const user = userMap.get(request.userId);
      const subject = subjectMap.get(request.subjectId);

      // Validaciones rápidas
      if (!user) {
        skipped.push({
          request,
          reason: `Usuario ${request.userId} no encontrado`
        });
        continue;
      }

      if (!subject) {
        skipped.push({
          request,
          reason: `Asignatura ${request.subjectId} no encontrada`
        });
        continue;
      }

      if (subject.estado !== EstadoEnum.DISPONIBLE) {
        skipped.push({
          request,
          reason: `Asignatura "${subject.nombre}" no disponible (${subject.estado})`
        });
        continue;
      }

      // Verificar duplicado
      const existing = await this.enrollmentRepository.findOne({
        where: {
          user: { id: user.id },
          subject: { id: subject.id }
        }
      });

      if (existing) {
        skipped.push({
          request,
          reason: `Usuario ya inscrito en "${subject.nombre}"`
        });
        continue;
      }

      // Crear inscripción
      const enrollment = this.enrollmentRepository.create({ user, subject });
      const savedEnrollment = await this.enrollmentRepository.save(enrollment);
      created.push(savedEnrollment);
    }

    return { created, skipped };
  }

  /**
   * Obtener todas las inscripciones con relaciones
   */
  async findAll(): Promise<Enrollment[]> {
    return await this.enrollmentRepository.find({
      relations: ['user', 'subject'],
      order: {
        user: { name: 'ASC' },
        subject: { nombre: 'ASC' }
      }
    });
  }

  /**
   * Obtener inscripción por ID
   */
  async findOne(id: string): Promise<Enrollment> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { id },
      relations: ['user', 'subject']
    });

    if (!enrollment) {
      throw new NotFoundException(`Inscripción con ID ${id} no encontrada`);
    }

    return enrollment;
  }

  /**
   * Obtener inscripciones por usuario
   */
  async findByUser(userId: string): Promise<Enrollment[]> {
    // Verificar que el usuario existe
    const user = await this.userRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    return await this.enrollmentRepository.find({
      where: { user: { id: userId } },
      relations: ['subject'],
      order: {
        subject: { nombre: 'ASC' }
      }
    });
  }

  /**
   * Obtener inscripciones por asignatura
   */
  async findBySubject(subjectId: string): Promise<Enrollment[]> {
    // Verificar que la asignatura existe
    const subject = await this.subjectRepository.findOne({
      where: { id: subjectId }
    });

    if (!subject) {
      throw new NotFoundException(`Asignatura con ID ${subjectId} no encontrada`);
    }

    return await this.enrollmentRepository.find({
      where: { subject: { id: subjectId } },
      relations: ['user'],
      order: {
        user: { name: 'ASC' }
      }
    });
  }

  /**
   * Obtener TODOS los datos del usuario dado el nombre de una asignatura
   * (Solicitado específicamente)
   */
  async findUsersBySubjectName(subjectName: string): Promise<User[]> {
    // Buscar la asignatura por nombre
    const subject = await this.subjectRepository.findOne({
      where: { nombre: subjectName }
    });

    if (!subject) {
      throw new NotFoundException(`Asignatura con nombre "${subjectName}" no encontrada`);
    }

    // Buscar todas las inscripciones para esta asignatura
    const enrollments = await this.enrollmentRepository.find({
      where: { subject: { id: subject.id } },
      relations: ['user'] // Carga todos los datos del usuario
    });

    // Extraer los usuarios de las inscripciones
    return enrollments.map(enrollment => enrollment.user);
  }

  /**
   * Obtener usuarios por nombre de asignatura con paginación
   */
  async findUsersBySubjectNamePaginated(
    subjectName: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ users: User[]; total: number; page: number; totalPages: number }> {
    const subject = await this.subjectRepository.findOne({
      where: { nombre: subjectName }
    });

    if (!subject) {
      throw new NotFoundException(`Asignatura con nombre "${subjectName}" no encontrada`);
    }

    const [enrollments, total] = await this.enrollmentRepository.findAndCount({
      where: { subject: { id: subject.id } },
      relations: ['user'],
      skip: (page - 1) * limit,
      take: limit,
      order: { user: { name: 'ASC' } }
    });

    return {
      users: enrollments.map(enrollment => enrollment.user),
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * Obtener inscripciones por usuario y estado de asignatura
   */
  async findUserEnrollmentsBySubjectStatus(userId: string, status: EstadoEnum): Promise<Enrollment[]> {
    return await this.enrollmentRepository.find({
      where: {
        user: { id: userId },
        subject: { estado: status }
      },
      relations: ['subject'],
      order: {
        subject: { nombre: 'ASC' }
      }
    });
  }

  /**
   * Actualizar inscripción
   */
  async update(id: string, updateEnrollmentDto: UpdateEnrollmentDto): Promise<Enrollment> {
    const enrollment = await this.findOne(id);

    // Si se quiere cambiar el usuario
    if (updateEnrollmentDto.userId && updateEnrollmentDto.userId !== enrollment.user.id) {
      const newUser = await this.userRepository.findOne({
        where: { id: updateEnrollmentDto.userId }
      });

      if (!newUser) {
        throw new NotFoundException(`Nuevo usuario con ID ${updateEnrollmentDto.userId} no encontrado`);
      }
      enrollment.user = newUser;
    }

    // Si se quiere cambiar la asignatura
    if (updateEnrollmentDto.subjectId && updateEnrollmentDto.subjectId !== enrollment.subject.id) {
      const newSubject = await this.subjectRepository.findOne({
        where: { id: updateEnrollmentDto.subjectId }
      });

      if (!newSubject) {
        throw new NotFoundException(`Nueva asignatura con ID ${updateEnrollmentDto.subjectId} no encontrada`);
      }

      // Validar que no exista ya una inscripción para este usuario en la nueva asignatura
      const existingEnrollment = await this.enrollmentRepository.findOne({
        where: {
          user: { id: enrollment.user.id },
          subject: { id: newSubject.id },
          id: Not(id) // Excluir la inscripción actual
        }
      });

      if (existingEnrollment) {
        throw new ConflictException(`El usuario ya está inscrito en la asignatura "${newSubject.nombre}"`);
      }

      enrollment.subject = newSubject;
    }

    return await this.enrollmentRepository.save(enrollment);
  }

  /**
   * Eliminar inscripción
   */
  async remove(id: string): Promise<{ message: string }> {
    const enrollment = await this.findOne(id);
    
    await this.enrollmentRepository.remove(enrollment);
    
    return {
      message: `Inscripción eliminada exitosamente`
    };
  }

  /**
   * Eliminar inscripción por usuario y asignatura
   */
  async removeByUserAndSubject(userId: string, subjectId: string): Promise<{ message: string }> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: {
        user: { id: userId },
        subject: { id: subjectId }
      }
    });

    if (!enrollment) {
      throw new NotFoundException(`El usuario no está inscrito en esta asignatura`);
    }

    await this.enrollmentRepository.remove(enrollment);
    
    return {
      message: `Inscripción eliminada exitosamente`
    };
  }

  /**
   * Verificar si un usuario está inscrito en una asignatura
   */
  async isUserEnrolled(userId: string, subjectId: string): Promise<boolean> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: {
        user: { id: userId },
        subject: { id: subjectId }
      }
    });

    return !!enrollment;
  }

  /**
   * Contar inscripciones por asignatura
   */
  async countBySubject(subjectId: string): Promise<number> {
    return await this.enrollmentRepository.count({
      where: { subject: { id: subjectId } }
    });
  }

  /**
   * Contar inscripciones por usuario
   */
  async countByUser(userId: string): Promise<number> {
    return await this.enrollmentRepository.count({
      where: { user: { id: userId } }
    });
  }

  /**
   * Obtener asignaturas disponibles para un usuario (no inscritas)
   */
  async getAvailableSubjectsForUser(userId: string): Promise<Subject[]> {
    // Obtener todas las asignaturas en las que el usuario está inscrito
    const userEnrollments = await this.findByUser(userId);
    const enrolledSubjectIds = userEnrollments.map(enrollment => enrollment.subject.id);

    // Buscar asignaturas disponibles que no estén inscritas
    return await this.subjectRepository.find({
      where: {
        id: Not(In(enrolledSubjectIds)),
        estado: EstadoEnum.DISPONIBLE
      },
      order: { nombre: 'ASC' }
    });
  }

  /**
   * Obtener estadísticas de inscripciones
   */
  async getStatistics(): Promise<{
    totalEnrollments: number;
    enrolledBySubject: Array<{ subjectName: string; count: number }>;
    enrolledByFaculty: Array<{ faculty: string; count: number }>;
  }> {
    const totalEnrollments = await this.enrollmentRepository.count();

    // Estadísticas por asignatura
    const enrollmentsBySubject = await this.enrollmentRepository
      .createQueryBuilder('enrollment')
      .select('subject.nombre', 'subjectName')
      .addSelect('COUNT(enrollment.id)', 'count')
      .leftJoin('enrollment.subject', 'subject')
      .groupBy('subject.id, subject.nombre')
      .orderBy('count', 'DESC')
      .getRawMany();

    // Estadísticas por facultad del usuario
    const enrollmentsByFaculty = await this.enrollmentRepository
      .createQueryBuilder('enrollment')
      .select('user.faculty', 'faculty')
      .addSelect('COUNT(enrollment.id)', 'count')
      .leftJoin('enrollment.user', 'user')
      .groupBy('user.faculty')
      .orderBy('count', 'DESC')
      .getRawMany();

    return {
      totalEnrollments,
      enrolledBySubject: enrollmentsBySubject,
      enrolledByFaculty: enrollmentsByFaculty
    };
  }
}