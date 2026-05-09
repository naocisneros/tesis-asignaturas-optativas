
import { ApiProperty } from '@nestjs/swagger';
import { ActivityType } from '../enum/activity-type.enum';

export class ResponseContentDistributionDto {
  @ApiProperty({ description: 'ID único de la distribución' })
  id: string;

  @ApiProperty({ description: 'UUID de la asignatura' })
  subjectId: string;

  @ApiProperty({ description: 'Nombre de la asignatura' })
  subjectName: string;

  @ApiProperty({ description: 'Número de semana' })
  weekNumber: number;

  @ApiProperty({ description: 'Tipo de actividad', enum: ActivityType })
  activityType: ActivityType;

  @ApiProperty({ description: 'Título del tema' })
  topicTitle: string;

  @ApiProperty({ description: 'Descripción del contenido' })
  contentDescription: string;

  @ApiProperty({ description: 'Duración en horas' })
  durationHours: number;

  @ApiProperty({ description: 'Período académico' })
  academicPeriod: string;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de actualización' })
  updatedAt: Date;
}