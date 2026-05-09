
import { 
  Injectable, 
  NotFoundException, 
  BadRequestException,
  InternalServerErrorException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere, Between } from 'typeorm';
import { ContentDistribution } from './entity/content-distribution.entity';
import { Subject } from 'src/subjects/entity/subject.entity';
import { CreateContentDistributionDto } from './dto/create-content-distribution.dto';
import { UpdateContentDistributionDto } from './dto/update-content-distribution.dto';
import { FilterContentDistributionDto } from './dto/content-distribution.filters.dto';

@Injectable()
export class ContentDistributionService {
  constructor(
    @InjectRepository(ContentDistribution)
    private contentDistributionRepository: Repository<ContentDistribution>,
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,
  ) {}

  async create(createDto: CreateContentDistributionDto): Promise<ContentDistribution> {
    // Validar que la asignatura existe
    const subject = await this.subjectRepository.findOne({
      where: { id: createDto.subjectId }
    });

    if (!subject) {
      throw new NotFoundException(`Subject with ID ${createDto.subjectId} not found`);
    }

    // Validar que no exista duplicado
    await this.validateUniqueDistribution(
      createDto.subjectId, 
      createDto.weekNumber, 
      createDto.academicPeriod
    );

    // Validar fechas
    if (createDto.startDate && createDto.endDate && createDto.startDate > createDto.endDate) {
      throw new BadRequestException('Start date cannot be after end date');
    }

    const distribution = this.contentDistributionRepository.create({
      ...createDto,
      subject
    });

    try {
      return await this.contentDistributionRepository.save(distribution);
    } catch (error) {
      throw new InternalServerErrorException('Error creating content distribution');
    }
  }

  async findAll(filters: FilterContentDistributionDto): Promise<{ data: ContentDistribution[]; total: number }> {
    const { page = 1, limit = 10, sortBy = 'weekNumber', sortOrder = 'ASC', ...filterParams } = filters;
    const skip = (page - 1) * limit;

    // Construir condiciones de filtro
    const whereConditions: FindOptionsWhere<ContentDistribution> = {};
    
    if (filterParams.subjectId) whereConditions.subjectId = filterParams.subjectId;
    if (filterParams.weekNumber) whereConditions.weekNumber = filterParams.weekNumber;
    if (filterParams.activityType) whereConditions.activityType = filterParams.activityType;
    if (filterParams.academicPeriod) whereConditions.academicPeriod = filterParams.academicPeriod;
    if (filterParams.isActive !== undefined) whereConditions.isActive = filterParams.isActive;

    // Búsqueda con paginación
    const [data, total] = await this.contentDistributionRepository.findAndCount({
      where: whereConditions,
      relations: ['subject'],
      order: { [sortBy]: sortOrder },
      skip,
      take: limit,
    });

    return { data, total };
  }

  async findOne(id: string): Promise<ContentDistribution> {
    const distribution = await this.contentDistributionRepository.findOne({
      where: { id },
      relations: ['subject']
    });

    if (!distribution) {
      throw new NotFoundException(`Content distribution with ID ${id} not found`);
    }

    return distribution;
  }

  async findBySubject(subjectId: string, academicPeriod?: string): Promise<ContentDistribution[]> {
    const subject = await this.subjectRepository.findOne({
      where: { id: subjectId }
    });

    if (!subject) {
      throw new NotFoundException(`Subject with ID ${subjectId} not found`);
    }

    const query = this.contentDistributionRepository
      .createQueryBuilder('distribution')
      .leftJoinAndSelect('distribution.subject', 'subject')
      .where('distribution.subjectId = :subjectId', { subjectId });

    if (academicPeriod) {
      query.andWhere('distribution.academicPeriod = :academicPeriod', { academicPeriod });
    }

    return await query
      .orderBy('distribution.weekNumber', 'ASC')
      .getMany();
  }

  async getWeeklySchedule(subjectId: string, weekNumber: number, academicPeriod: string): Promise<ContentDistribution> {
    const distribution = await this.contentDistributionRepository.findOne({
      where: { 
        subjectId, 
        weekNumber,
        academicPeriod 
      },
      relations: ['subject']
    });

    if (!distribution) {
      throw new NotFoundException(
        `No content distribution found for subject ${subjectId}, week ${weekNumber}, period ${academicPeriod}`
      );
    }

    return distribution;
  }

  async update(id: string, updateDto: UpdateContentDistributionDto): Promise<ContentDistribution> {
    const distribution = await this.findOne(id);

    // Si se está actualizando la asignatura, validar que existe
    if (updateDto.subjectId && updateDto.subjectId !== distribution.subjectId) {
      const subject = await this.subjectRepository.findOne({
        where: { id: updateDto.subjectId }
      });
      if (!subject) {
        throw new NotFoundException(`Subject with ID ${updateDto.subjectId} not found`);
      }
      distribution.subject = subject;
      distribution.subjectId = updateDto.subjectId;
    }

    // Validar unicidad si cambia semana, asignatura o período
    if (
      (updateDto.weekNumber && updateDto.weekNumber !== distribution.weekNumber) ||
      (updateDto.academicPeriod && updateDto.academicPeriod !== distribution.academicPeriod) ||
      updateDto.subjectId
    ) {
      await this.validateUniqueDistribution(
        updateDto.subjectId || distribution.subjectId,
        updateDto.weekNumber || distribution.weekNumber,
        updateDto.academicPeriod || distribution.academicPeriod,
        id
      );
    }

    // Validar fechas
    if (updateDto.startDate && updateDto.endDate && updateDto.startDate > updateDto.endDate) {
      throw new BadRequestException('Start date cannot be after end date');
    }

    // Actualizar campos
    Object.assign(distribution, updateDto);

    try {
      return await this.contentDistributionRepository.save(distribution);
    } catch (error) {
      throw new InternalServerErrorException('Error updating content distribution');
    }
  }

  async remove(id: string): Promise<void> {
    const distribution = await this.findOne(id);
    
    try {
      // Soft delete - marcar como inactivo
      distribution.isActive = false;
      await this.contentDistributionRepository.save(distribution);
      
      // Para hard delete (eliminación física):
      // await this.contentDistributionRepository.remove(distribution);
    } catch (error) {
      throw new InternalServerErrorException('Error deleting content distribution');
    }
  }

  async hardRemove(id: string): Promise<void> {
    const distribution = await this.findOne(id);
    
    try {
      await this.contentDistributionRepository.remove(distribution);
    } catch (error) {
      throw new InternalServerErrorException('Error permanently deleting content distribution');
    }
  }

  async restore(id: string): Promise<ContentDistribution> {
    const distribution = await this.contentDistributionRepository.findOne({
      where: { id },
      withDeleted: true // Si usas soft delete con @DeleteDateColumn
    });

    if (!distribution) {
      throw new NotFoundException(`Content distribution with ID ${id} not found`);
    }

    distribution.isActive = true;
    return await this.contentDistributionRepository.save(distribution);
  }

  async getByWeekRange(subjectId: string, startWeek: number, endWeek: number, academicPeriod: string): Promise<ContentDistribution[]> {
    return await this.contentDistributionRepository.find({
      where: {
        subjectId,
        academicPeriod,
        weekNumber: Between(startWeek, endWeek),
        isActive: true
      },
      relations: ['subject'],
      order: { weekNumber: 'ASC' }
    });
  }

  private async validateUniqueDistribution(
    subjectId: string, 
    weekNumber: number, 
    academicPeriod: string, 
    excludeId?: string
  ): Promise<void> {
    const queryBuilder = this.contentDistributionRepository
      .createQueryBuilder('distribution')
      .where('distribution.subjectId = :subjectId', { subjectId })
      .andWhere('distribution.weekNumber = :weekNumber', { weekNumber })
      .andWhere('distribution.academicPeriod = :academicPeriod', { academicPeriod });

    if (excludeId) {
      queryBuilder.andWhere('distribution.id != :excludeId', { excludeId });
    }

    const existing = await queryBuilder.getOne();

    if (existing) {
      throw new BadRequestException(
        `Content distribution already exists for subject ${subjectId}, week ${weekNumber}, period ${academicPeriod}`
      );
    }
  }
}