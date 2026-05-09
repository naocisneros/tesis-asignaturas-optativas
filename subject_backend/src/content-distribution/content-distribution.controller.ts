
import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
  ParseUUIDPipe,
  DefaultValuePipe,
  ParseIntPipe
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiBody
} from '@nestjs/swagger';
import { ContentDistributionService } from './content-distribution.service';
import { CreateContentDistributionDto } from './dto/create-content-distribution.dto';
import { UpdateContentDistributionDto } from './dto/update-content-distribution.dto';
import { FilterContentDistributionDto } from './dto/content-distribution.filters.dto';
import { ResponseContentDistributionDto } from './dto/response-content-distribution.dto';
import { PaginatedResponseDto } from './dto/paginated-response.dto';

@ApiTags('Distribución de Contenidos')
@ApiBearerAuth()
@Controller('content-distribution')
export class ContentDistributionController {
  constructor(private readonly service: ContentDistributionService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Crear una nueva distribución de contenido',
    description: 'Crea una nueva distribución de contenido validando que la asignatura exista en la base de datos'
  })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Distribución creada exitosamente',
    type: ResponseContentDistributionDto
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Datos inválidos o duplicados' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Asignatura no encontrada' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error del servidor' })
  @ApiBody({ type: CreateContentDistributionDto })
  async create(@Body() createDto: CreateContentDistributionDto): Promise<ResponseContentDistributionDto> {
    const distribution = await this.service.create(createDto);
    return this.mapToResponseDto(distribution);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Listar todas las distribuciones de contenido',
    description: 'Obtiene una lista paginada de distribuciones con filtros opcionales'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de distribuciones obtenida exitosamente',
    type: PaginatedResponseDto
  })
  async findAll(@Query() filters: FilterContentDistributionDto): Promise<PaginatedResponseDto> {
    const { data, total } = await this.service.findAll(filters);
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    
    return {
      data: data.map(item => this.mapToResponseDto(item)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  @Get('subject/:subjectId')
  @ApiOperation({ 
    summary: 'Obtener distribuciones por asignatura',
    description: 'Lista todas las distribuciones de contenido para una asignatura específica'
  })
  @ApiParam({ name: 'subjectId', description: 'UUID de la asignatura', type: 'string' })
  @ApiQuery({ name: 'academicPeriod', required: false, description: 'Período académico', example: '2024-1' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Distribuciones obtenidas exitosamente',
    type: [ResponseContentDistributionDto]
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Asignatura no encontrada' })
  async findBySubject(
    @Param('subjectId', ParseUUIDPipe) subjectId: string,
    @Query('academicPeriod') academicPeriod?: string
  ): Promise<ResponseContentDistributionDto[]> {
    const distributions = await this.service.findBySubject(subjectId, academicPeriod);
    return distributions.map(item => this.mapToResponseDto(item));
  }

  @Get('schedule/:subjectId/week/:weekNumber')
  @ApiOperation({ 
    summary: 'Obtener horario semanal',
    description: 'Obtiene la distribución de contenido para una semana específica'
  })
  @ApiParam({ name: 'subjectId', description: 'UUID de la asignatura', type: 'string' })
  @ApiParam({ name: 'weekNumber', description: 'Número de semana', example: 5, type: 'number' })
  @ApiQuery({ name: 'academicPeriod', required: true, description: 'Período académico', example: '2024-1' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Horario obtenido exitosamente',
    type: ResponseContentDistributionDto
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Distribución no encontrada' })
  async getWeeklySchedule(
    @Param('subjectId', ParseUUIDPipe) subjectId: string,
    @Param('weekNumber', ParseIntPipe) weekNumber: number,
    @Query('academicPeriod') academicPeriod: string
  ): Promise<ResponseContentDistributionDto> {
    const distribution = await this.service.getWeeklySchedule(subjectId, weekNumber, academicPeriod);
    return this.mapToResponseDto(distribution);
  }

  @Get('range/:subjectId')
  @ApiOperation({ 
    summary: 'Obtener distribuciones por rango de semanas',
    description: 'Obtiene todas las distribuciones en un rango específico de semanas'
  })
  @ApiParam({ name: 'subjectId', description: 'UUID de la asignatura', type: 'string' })
  @ApiQuery({ name: 'startWeek', required: true, description: 'Semana inicial', example: 1, type: 'number' })
  @ApiQuery({ name: 'endWeek', required: true, description: 'Semana final', example: 10, type: 'number' })
  @ApiQuery({ name: 'academicPeriod', required: true, description: 'Período académico', example: '2024-1' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Distribuciones obtenidas exitosamente',
    type: [ResponseContentDistributionDto]
  })
  async getByWeekRange(
    @Param('subjectId', ParseUUIDPipe) subjectId: string,
    @Query('startWeek', ParseIntPipe) startWeek: number,
    @Query('endWeek', ParseIntPipe) endWeek: number,
    @Query('academicPeriod') academicPeriod: string
  ): Promise<ResponseContentDistributionDto[]> {
    const distributions = await this.service.getByWeekRange(subjectId, startWeek, endWeek, academicPeriod);
    return distributions.map(item => this.mapToResponseDto(item));
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener una distribución por ID',
    description: 'Obtiene los detalles completos de una distribución específica'
  })
  @ApiParam({ name: 'id', description: 'UUID de la distribución', type: 'string' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Distribución encontrada',
    type: ResponseContentDistributionDto
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Distribución no encontrada' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseContentDistributionDto> {
    const distribution = await this.service.findOne(id);
    return this.mapToResponseDto(distribution);
  }

  @Put(':id')
  @ApiOperation({ 
    summary: 'Actualizar una distribución completamente',
    description: 'Actualiza todos los campos de una distribución existente'
  })
  @ApiParam({ name: 'id', description: 'UUID de la distribución', type: 'string' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Distribución actualizada exitosamente',
    type: ResponseContentDistributionDto
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Datos inválidos' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Distribución no encontrada' })
  @ApiBody({ type: UpdateContentDistributionDto })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateContentDistributionDto
  ): Promise<ResponseContentDistributionDto> {
    const distribution = await this.service.update(id, updateDto);
    return this.mapToResponseDto(distribution);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar parcialmente una distribución',
    description: 'Actualiza campos específicos de una distribución existente'
  })
  @ApiParam({ name: 'id', description: 'UUID de la distribución', type: 'string' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Distribución actualizada exitosamente',
    type: ResponseContentDistributionDto
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Datos inválidos' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Distribución no encontrada' })
  async patch(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateContentDistributionDto
  ): Promise<ResponseContentDistributionDto> {
    const distribution = await this.service.update(id, updateDto);
    return this.mapToResponseDto(distribution);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Eliminar una distribución (soft delete)',
    description: 'Marca una distribución como inactiva sin eliminarla físicamente'
  })
  @ApiParam({ name: 'id', description: 'UUID de la distribución', type: 'string' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Distribución eliminada exitosamente' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Distribución no encontrada' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.service.remove(id);
  }

  @Delete(':id/hard')
  @ApiOperation({ 
    summary: 'Eliminar una distribución permanentemente',
    description: 'Elimina físicamente una distribución de la base de datos'
  })
  @ApiParam({ name: 'id', description: 'UUID de la distribución', type: 'string' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Distribución eliminada permanentemente' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Distribución no encontrada' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async hardRemove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.service.hardRemove(id);
  }

  @Patch(':id/restore')
  @ApiOperation({ 
    summary: 'Restaurar una distribución eliminada',
    description: 'Reactiva una distribución que fue eliminada con soft delete'
  })
  @ApiParam({ name: 'id', description: 'UUID de la distribución', type: 'string' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Distribución restaurada exitosamente',
    type: ResponseContentDistributionDto
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Distribución no encontrada' })
  async restore(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseContentDistributionDto> {
    const distribution = await this.service.restore(id);
    return this.mapToResponseDto(distribution);
  }

  private mapToResponseDto(distribution: any): ResponseContentDistributionDto {
    return {
      id: distribution.id,
      subjectId: distribution.subjectId,
      subjectName: distribution.subject?.name || 'N/A',
      weekNumber: distribution.weekNumber,
      activityType: distribution.activityType,
      topicTitle: distribution.topicTitle,
      contentDescription: distribution.contentDescription,
      durationHours: distribution.durationHours,
      academicPeriod: distribution.academicPeriod,
      createdAt: distribution.createdAt,
      updatedAt: distribution.updatedAt
    };
  }
}