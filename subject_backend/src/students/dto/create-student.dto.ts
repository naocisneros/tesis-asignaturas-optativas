import { 
    IsString, 
    IsOptional, 
    IsInt, 
    Min, 
    MaxLength, 
    IsIn, Max
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStudentDto {
    @IsString({ message: 'El nombre debe ser un texto' })
    @MaxLength(100, { message: 'El nombre no puede exceder los 100 caracteres' })
    @ApiProperty({ description: 'Nombre del estudiante', example: 'Juan' })
    nombre: string;

    @IsString({ message: 'Los apellidos deben ser un texto' })
    @MaxLength(100, { message: 'Los apellidos no pueden exceder los 100 caracteres' })
    @ApiProperty({ description: 'Apellidos del estudiante', example: 'Pérez Gómez' })
    apellidos: string;

    @IsString({ message: 'La facultad debe ser un texto' })
    @MaxLength(150, { message: 'La facultad no puede exceder los 150 caracteres' })
    @ApiProperty({ description: 'Facultad a la que pertenece', example: 'Ingeniería' })
    facultad: string;

    @IsInt({ message: 'El año académico debe ser un número entero' })
    @Min(1)
    @Max(5)
    @ApiProperty({ description: 'Año académico actual', example: 2025 })
    año_academico: number;

    @IsString({ message: 'El grupo docente debe ser un texto' })
    @MaxLength(50, { message: 'El grupo docente no puede exceder los 50 caracteres' })
    @ApiProperty({ description: 'Grupo docente al que pertenece', example: 'A' })
    grupo_docente: string;

    @IsOptional()
    @IsString({ message: 'El estado debe ser un texto' })
    @IsIn(['activo', 'inactivo', 'graduado'], { message: 'El estado debe ser: activo, inactivo o graduado' })
    @ApiPropertyOptional({ description: 'Estado del estudiante', example: 'activo', default: 'activo' })
    estado?: string;

    @IsOptional()
    @IsString({ message: 'Los avales deben ser texto' })
    @ApiPropertyOptional({ description: 'Información sobre avales del estudiante', example: 'Avalado por el departamento de matemáticas' })
    avales?: string;
}