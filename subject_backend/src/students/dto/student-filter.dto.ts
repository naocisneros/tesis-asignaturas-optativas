import { IsOptional, IsString, IsInt, Min, Max, IsDateString, IsEnum, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { StudentOrderBy } from '../enum/sort';

export class FilterStudentDto {
    @IsOptional()
    @IsString()
    nombre?: string;

    @IsOptional()
    @IsString()
    apellidos?: string;

    @IsOptional()
    @IsString()
    facultad?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1900)
    añoAcademicoMin?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1900)
    añoAcademicoMax?: number;

    @IsOptional()
    @IsString()
    grupoDocente?: string;

    @IsOptional()
    @IsIn(['activo', 'inactivo', 'graduado'])
    estado?: string;

    @IsOptional()
    @IsString()
    avales?: string;

    @IsOptional()
    @IsEnum(StudentOrderBy)
    orderBy?: StudentOrderBy;

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