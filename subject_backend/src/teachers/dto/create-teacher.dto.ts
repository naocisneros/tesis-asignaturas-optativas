import { 
    IsString, 
    IsEmail, 
    IsOptional, 
    IsInt, 
    Min, 
    MaxLength, 
    IsUrl,
    Matches, 
    IsDate
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTeacherDto {
    @IsString({ message: 'El nombre debe ser un texto' })
    @MaxLength(100, { message: 'El nombre no puede exceder los 100 caracteres' })
    nombre: string;

    @IsString({ message: 'El apellido debe ser un texto' })
    @MaxLength(100, { message: 'El apellido no puede exceder los 100 caracteres' })
    apellido: string;

    @IsEmail({}, { message: 'Debe proporcionar un email válido' })
    @MaxLength(150, { message: 'El email no puede exceder los 150 caracteres' })
    email: string;

    @IsOptional()
    @IsString({ message: 'El teléfono debe ser un texto' })
    @MaxLength(20, { message: 'El teléfono no puede exceder los 20 caracteres' })
    @Matches(/^[0-9+\-\s()]+$/, { message: 'El teléfono solo puede contener números, +, -, espacios y paréntesis' })
    telefono?: string;

    @IsOptional()
    @IsString({ message: 'El documento de identidad debe ser un texto' })
    @MaxLength(20, { message: 'El documento de identidad no puede exceder los 20 caracteres' })
    documento_identidad?: string;

    @ApiProperty({ 
        description: 'Fecha de contratación', 
        example: '2020-01-15'
    })
    @IsDate()
    fecha_contratacion: Date;

    @ApiPropertyOptional({ 
        description: 'Fecha de terminación de contrato', 
        example: '2024-12-31'
    })
    @IsOptional()
    @IsDate()
    fecha_terminacion?: Date;

    @IsOptional()
    @IsString({ message: 'Los títulos académicos deben ser un texto' })
    titulos_academicos?: string;

    @IsInt({ message: 'Los años de experiencia deben ser un número entero' })
    @Min(0, { message: 'Los años de experiencia no pueden ser negativos' })
    años_experiencia: number;

    @IsOptional()
    @IsString({ message: 'La dirección debe ser un texto' })
    @MaxLength(255, { message: 'La dirección no puede exceder los 255 caracteres' })
    direccion?: string;

    @ApiPropertyOptional({ 
        description: 'Fecha de nacimiento', 
        example: '1985-06-20'
    })
    @IsOptional()
    @IsDate()
    fecha_nacimiento?: Date;

    @IsOptional()
    @IsString({ message: 'La nacionalidad debe ser un texto' })
    @MaxLength(50, { message: 'La nacionalidad no puede exceder los 50 caracteres' })
    nacionalidad?: string;

    @IsOptional()
    @IsUrl({}, { message: 'La URL de la foto debe ser una URL válida' })
    @MaxLength(255, { message: 'La URL de la foto no puede exceder los 255 caracteres' })
    foto_url?: string;
}