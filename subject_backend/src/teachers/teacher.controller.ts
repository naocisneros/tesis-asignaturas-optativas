import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Patch, 
    Param, 
    Delete, 
    Query, 
    HttpStatus,
    HttpCode,
    ParseUUIDPipe
} from "@nestjs/common";
import { 
    ApiTags, 
    ApiOperation, 
    ApiResponse, 
    ApiQuery, 
    ApiParam, 
    ApiBearerAuth,
    ApiExtraModels,
    getSchemaPath
} from "@nestjs/swagger";
import { TeacherService } from "./teacher.service";
import { CreateTeacherDto, FilterTeacherDto, UpdateTeacherDto } from "./dto";
import { Teacher } from "./entity/teacher.entity";
import { TeacherOrderBy } from "./enum/sort";

// DTO para la respuesta paginada (para Swagger)
class PaginatedResponseDto {
    data: Teacher[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

@ApiTags('Profesores')
@ApiBearerAuth()
@Controller('teachers')
@ApiExtraModels(PaginatedResponseDto, Teacher)
export class TeacherController {
    constructor(private readonly teacherService: TeacherService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ 
        summary: 'Crear un nuevo profesor', 
        description: 'Crea un nuevo profesor en el sistema con los datos proporcionados'
    })
    @ApiResponse({ 
        status: HttpStatus.CREATED, 
        description: 'Profesor creado exitosamente',
        type: Teacher
    })
    @ApiResponse({ 
        status: HttpStatus.BAD_REQUEST, 
        description: 'Datos de entrada inválidos' 
    })
    @ApiResponse({ 
        status: HttpStatus.CONFLICT, 
        description: 'Email o documento de identidad ya existe' 
    })
    async create(@Body() createTeacherDto: CreateTeacherDto): Promise<Teacher> {
        return this.teacherService.create(createTeacherDto);
    }

    @Get()
    @ApiOperation({ 
        summary: 'Obtener todos los profesores', 
        description: 'Retorna una lista paginada de profesores con filtros opcionales'
    })
    @ApiResponse({ 
        status: HttpStatus.OK, 
        description: 'Lista de profesores obtenida exitosamente',
        schema: {
            allOf: [
                { $ref: getSchemaPath(PaginatedResponseDto) },
                {
                    properties: {
                        data: {
                            type: 'array',
                            items: { $ref: getSchemaPath(Teacher) }
                        }
                    }
                }
            ]
        }
    })
    @ApiQuery({ name: 'nombre', required: false, description: 'Filtrar por nombre (búsqueda parcial)', example: 'Juan' })
    @ApiQuery({ name: 'apellido', required: false, description: 'Filtrar por apellido (búsqueda parcial)', example: 'Pérez' })
    @ApiQuery({ name: 'email', required: false, description: 'Filtrar por email (búsqueda parcial)', example: 'juan@email.com' })
    @ApiQuery({ name: 'añosExperienciaMin', required: false, description: 'Experiencia mínima en años', example: 5, type: Number })
    @ApiQuery({ name: 'añosExperienciaMax', required: false, description: 'Experiencia máxima en años', example: 20, type: Number })
    @ApiQuery({ name: 'fechaContratacionDesde', required: false, description: 'Fecha de contratación desde (YYYY-MM-DD)', example: '2020-01-01' })
    @ApiQuery({ name: 'fechaContratacionHasta', required: false, description: 'Fecha de contratación hasta (YYYY-MM-DD)', example: '2023-12-31' })
    @ApiQuery({ name: 'fechaNacimientoDesde', required: false, description: 'Fecha de nacimiento desde (YYYY-MM-DD)', example: '1980-01-01' })
    @ApiQuery({ name: 'fechaNacimientoHasta', required: false, description: 'Fecha de nacimiento hasta (YYYY-MM-DD)', example: '2000-12-31' })
    @ApiQuery({ name: 'nacionalidad', required: false, description: 'Filtrar por nacionalidad exacta', example: 'Mexicana' })
    @ApiQuery({ 
        name: 'orderBy', 
        required: false, 
        description: 'Campo por el cual ordenar',
        enum: TeacherOrderBy,
        example: TeacherOrderBy.APELLIDO_ASC
    })
    @ApiQuery({ name: 'page', required: false, description: 'Número de página', example: 1, type: Number })
    @ApiQuery({ name: 'limit', required: false, description: 'Cantidad de elementos por página', example: 20, type: Number })
    async findAll(@Query() filterDto: FilterTeacherDto) {
        return this.teacherService.findAll(filterDto);
    }

    @Get(':id')
    @ApiOperation({ 
        summary: 'Obtener un profesor por ID', 
        description: 'Retorna un profesor específico basado en su UUID'
    })
    @ApiParam({ 
        name: 'id', 
        description: 'UUID del profesor', 
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: 'string'
    })
    @ApiResponse({ 
        status: HttpStatus.OK, 
        description: 'Profesor encontrado',
        type: Teacher
    })
    @ApiResponse({ 
        status: HttpStatus.NOT_FOUND, 
        description: 'Profesor no encontrado' 
    })
    @ApiResponse({ 
        status: HttpStatus.BAD_REQUEST, 
        description: 'ID inválido (no es UUID)' 
    })
    async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Teacher> {
        return this.teacherService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ 
        summary: 'Actualizar un profesor', 
        description: 'Actualiza parcialmente los datos de un profesor existente'
    })
    @ApiParam({ 
        name: 'id', 
        description: 'UUID del profesor a actualizar', 
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: 'string'
    })
    @ApiResponse({ 
        status: HttpStatus.OK, 
        description: 'Profesor actualizado exitosamente',
        type: Teacher
    })
    @ApiResponse({ 
        status: HttpStatus.NOT_FOUND, 
        description: 'Profesor no encontrado' 
    })
    @ApiResponse({ 
        status: HttpStatus.BAD_REQUEST, 
        description: 'Datos de entrada inválidos o ID no válido' 
    })
    @ApiResponse({ 
        status: HttpStatus.CONFLICT, 
        description: 'Email o documento de identidad ya existe' 
    })
    async update(
        @Param('id', ParseUUIDPipe) id: string, 
        @Body() updateTeacherDto: UpdateTeacherDto
    ): Promise<Teacher> {
        return this.teacherService.update(id, updateTeacherDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ 
        summary: 'Eliminar un profesor', 
        description: 'Elimina permanentemente un profesor del sistema'
    })
    @ApiParam({ 
        name: 'id', 
        description: 'UUID del profesor a eliminar', 
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: 'string'
    })
    @ApiResponse({ 
        status: HttpStatus.NO_CONTENT, 
        description: 'Profesor eliminado exitosamente' 
    })
    @ApiResponse({ 
        status: HttpStatus.NOT_FOUND, 
        description: 'Profesor no encontrado' 
    })
    @ApiResponse({ 
        status: HttpStatus.BAD_REQUEST, 
        description: 'ID inválido (no es UUID)' 
    })
    async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
        await this.teacherService.remove(id);
    }
}