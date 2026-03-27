import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class CreateEnrollmentDto {
  @ApiProperty({ description: 'ID del usuario' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'ID de la asignatura' })
  @IsUUID()
  subjectId: string;

}