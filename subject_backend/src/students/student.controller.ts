import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    ParseUUIDPipe,
    HttpStatus,
    HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { StudentService } from './student.service';
import { CreateStudentDto, UpdateStudentDto, FilterStudentDto } from './dto';

@ApiTags('students')
@Controller('students')
export class StudentController {
    constructor(private readonly studentService: StudentService) {}

    @Post()
    @ApiOperation({ summary: 'Crear un nuevo estudiante' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Estudiante creado exitosamente' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Datos inválidos' })
    async create(@Body() createStudentDto: CreateStudentDto) {
        return this.studentService.create(createStudentDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todos los estudiantes con filtros y paginación' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Lista de estudiantes' })
    async findAll(@Query() filterDto: FilterStudentDto) {
        return this.studentService.findAll(filterDto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un estudiante por ID' })
    @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Estudiante encontrado' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Estudiante no existe' })
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.studentService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar un estudiante parcialmente' })
    @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Estudiante actualizado' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Estudiante no existe' })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateStudentDto: UpdateStudentDto,
    ) {
        return this.studentService.update(id, updateStudentDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Eliminar un estudiante' })
    @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
    @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Estudiante eliminado' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Estudiante no existe' })
    async remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.studentService.remove(id);
    }
}