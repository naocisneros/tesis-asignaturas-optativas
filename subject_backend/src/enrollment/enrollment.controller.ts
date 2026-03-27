import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { EnrollmentsService } from './enrollment.service';
import { CreateEnrollmentDto } from './dto';
import { UpdateEnrollmentDto } from './dto';
import { User } from '../users/entity/users.entity';
import { EstadoEnum } from '../subjects/enum/state.enum';

@ApiTags('enrollments')
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva inscripción' })
  async create(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    return await this.enrollmentsService.create(createEnrollmentDto);
  }

  @Post('bulk')
  async createBulk(@Body() body: { enrollments: Array<{ userId: string; subjectId: string }> }) {
    // Asegúrate de pasar el array correctamente al servicio
    return await this.enrollmentsService.createBulk(body.enrollments || []);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las inscripciones' })
  async findAll() {
    return await this.enrollmentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener inscripción por ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.enrollmentsService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Obtener inscripciones por usuario' })
  async findByUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return await this.enrollmentsService.findByUser(userId);
  }

  @Get('subject/:subjectId')
  @ApiOperation({ summary: 'Obtener inscripciones por asignatura' })
  async findBySubject(@Param('subjectId', ParseUUIDPipe) subjectId: string) {
    return await this.enrollmentsService.findBySubject(subjectId);
  }

  @Get('subject-name/:subjectName/users')
  @ApiOperation({ summary: 'Obtener TODOS los datos del usuario dado el nombre de una asignatura' })
  async findUsersBySubjectName(@Param('subjectName') subjectName: string) {
    return await this.enrollmentsService.findUsersBySubjectName(subjectName);
  }

  @Get('subject-name/:subjectName/users/paginated')
  @ApiOperation({ summary: 'Obtener usuarios por nombre de asignatura con paginación' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findUsersBySubjectNamePaginated(
    @Param('subjectName') subjectName: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return await this.enrollmentsService.findUsersBySubjectNamePaginated(subjectName, page, limit);
  }

  @Get('user/:userId/status/:status')
  @ApiOperation({ summary: 'Obtener inscripciones por usuario y estado de asignatura' })
  async findUserEnrollmentsBySubjectStatus(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('status') status: EstadoEnum
  ) {
    return await this.enrollmentsService.findUserEnrollmentsBySubjectStatus(userId, status);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar inscripción' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEnrollmentDto: UpdateEnrollmentDto
  ) {
    return await this.enrollmentsService.update(id, updateEnrollmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar inscripción' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.enrollmentsService.remove(id);
  }

  @Get('user/:userId/subject/:subjectId/is-enrolled')
  @ApiOperation({ summary: 'Verificar si un usuario está inscrito en una asignatura' })
  async isUserEnrolled(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('subjectId', ParseUUIDPipe) subjectId: string
  ) {
    const isEnrolled = await this.enrollmentsService.isUserEnrolled(userId, subjectId);
    return { isEnrolled };
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Obtener estadísticas de inscripciones' })
  async getStatistics() {
    return await this.enrollmentsService.getStatistics();
  }
}