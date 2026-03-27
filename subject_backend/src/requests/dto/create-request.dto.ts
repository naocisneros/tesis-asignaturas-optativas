import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, IsUUID, Max, Min } from "class-validator";

export class CreateRequestDto {
  @ApiProperty({ description: 'ID del usuario' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'ID de la asignatura' })
  @IsUUID()
  subjectId: string;

  @ApiProperty({ description: 'Opción (1-14)' })
  @IsInt()
  @Min(1)
  @Max(14)
  option: number;

  @ApiProperty({ description: 'Descripción opcional', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}