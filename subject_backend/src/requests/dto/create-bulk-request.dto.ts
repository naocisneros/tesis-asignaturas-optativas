
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, ValidateNested, IsString, IsOptional } from "class-validator";
import { CreateRequestDto } from "./create-request.dto";

export class CreateBulkRequestsDto {
  @ApiProperty({ 
    description: 'ID de sesión (opcional) para agrupar las solicitudes',
    required: false 
  })
  @IsOptional()
  @IsString()
  sessionId?: string;

  @ApiProperty({ 
    description: 'Lista de solicitudes (máximo 14: 7 matutinas + 7 vespertinas)',
    type: [CreateRequestDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRequestDto)
  requests: CreateRequestDto[];
}