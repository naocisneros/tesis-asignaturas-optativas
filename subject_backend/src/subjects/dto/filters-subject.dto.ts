import { Type } from "class-transformer";
import { IsDateString, IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";
import { CategoriaEnum } from "src/subjects/enum/category.enum";
import { SubjectOrderBy } from "src/subjects/enum/sort.enum";
import { EstadoEnum } from "src/subjects/enum/state.enum";
import { SeccionEnum } from "../enum/section.enum";


export class FilterSubjectDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsEnum(EstadoEnum)
  estado?: EstadoEnum;

  @IsOptional()
  @IsEnum(SeccionEnum)
  sección?: SeccionEnum

  @IsOptional()
  @IsEnum(CategoriaEnum)
  categoria?: CategoriaEnum;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  matriculaMin?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  matriculaMax?: number;

  @IsOptional()
  @IsDateString()
  fechaInicioDesde?: string; // Para fecha_de_inicio

  @IsOptional()
  @IsDateString()
  fechaInicioHasta?: string;

  @IsOptional()
  @IsDateString()
  fechaFinDesde?: string; // Para fecha_de_fin

  @IsOptional()
  @IsDateString()
  fechaFinHasta?: string;

  @IsOptional()
  @IsDateString()
  inicioMatriculaDesde?: string;

  @IsOptional()
  @IsDateString()
  inicioMatriculaHasta?: string;

  @IsOptional()
  @IsDateString()
  finMatriculaDesde?: string;

  @IsOptional()
  @IsDateString()
  finMatriculaHasta?: string;

  @IsOptional()
  @IsEnum(SubjectOrderBy)
  orderBy?: SubjectOrderBy;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  limit?: number;
}