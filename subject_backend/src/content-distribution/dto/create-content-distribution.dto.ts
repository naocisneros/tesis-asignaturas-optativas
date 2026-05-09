
import { 
  IsUUID, 
  IsInt, 
  Min, 
  Max, 
  IsEnum, 
  IsString, 
  IsOptional, 
  IsDecimal, 
  IsDateString, 
  Length, 
  MinLength,
  IsBoolean,
  IsJSON,
  IsUrl
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ActivityType } from '../enum/activity-type.enum';

// create-content-distribution.dto.ts (CORREGIDO)
export class CreateContentDistributionDto {
  @ApiProperty()
  @IsUUID()
  subjectId: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(52)
  weekNumber: number;

  @ApiProperty({ enum: ActivityType })
  @IsEnum(ActivityType)
  activityType: ActivityType;

  @ApiProperty()
  @IsString()
  @Length(5, 255)
  topicTitle: string;

  @ApiProperty()
  @IsString()
  @MinLength(10)
  contentDescription: string;

  @ApiPropertyOptional()
  @IsOptional()
  durationHours?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  learningObjectives?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  requiredMaterials?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  prerequisites?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  evaluationMethod?: string;

  @ApiProperty()
  @IsString()
  @Length(5, 20)
  academicPeriod: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endDate?: Date;
}