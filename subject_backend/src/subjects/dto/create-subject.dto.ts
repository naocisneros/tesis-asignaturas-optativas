import { IsDate, IsEnum, IsInt, IsNotEmpty, IsString, Min } from "class-validator";
import { EstadoEnum } from "../enum/state.enum";
import { CategoriaEnum } from "../enum/category.enum";
import { ApiProperty } from "@nestjs/swagger";
import { SeccionEnum } from "../enum/section.enum";

export class CreateSubjectDto {
    @ApiProperty({example: 'Técnicas de programación'})
    @IsString()
    @IsNotEmpty()
    nombre: string

    @ApiProperty({example: 'Asignatura que aborda los algoritmos y técnicas avanzadas de la programación actual'})
    @IsString()
    @IsNotEmpty()
    descripción: string

    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    @Min(0)
    matrícula: number
 
    @ApiProperty()
    @IsDate()
    @IsNotEmpty()
    inicio_de_matrícula: Date

    @ApiProperty()
    @IsDate()
    @IsNotEmpty()
    fin_de_matrícula: Date

    @ApiProperty()
    @IsDate()
    @IsNotEmpty()
    fecha_de_inicio: Date

    @ApiProperty()
    @IsDate()
    @IsNotEmpty()
    fecha_de_fin: Date

    @ApiProperty()
    @IsEnum(EstadoEnum)
    estado?: EstadoEnum

    @ApiProperty()
    @IsEnum(CategoriaEnum)
    categoría?: CategoriaEnum
    
    @ApiProperty()
    @IsEnum(SeccionEnum)
    sección?: SeccionEnum
}