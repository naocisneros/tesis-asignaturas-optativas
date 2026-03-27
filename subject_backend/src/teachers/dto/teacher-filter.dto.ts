import { IsOptional, IsString, IsInt, Min, Max, IsDateString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { TeacherOrderBy } from '../enum/sort';

export class FilterTeacherDto {
    @IsOptional()
    @IsString()
    nombre?: string;

    @IsOptional()
    @IsString()
    apellido?: string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    añosExperienciaMin?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    añosExperienciaMax?: number;

    @IsOptional()
    @IsDateString()
    fechaContratacionDesde?: string;

    @IsOptional()
    @IsDateString()
    fechaContratacionHasta?: string;

    @IsOptional()
    @IsDateString()
    fechaNacimientoDesde?: string;

    @IsOptional()
    @IsDateString()
    fechaNacimientoHasta?: string;

    @IsOptional()
    @IsString()
    nacionalidad?: string;

    @IsOptional()
    @IsEnum(TeacherOrderBy)
    orderBy?: TeacherOrderBy;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 20;
}