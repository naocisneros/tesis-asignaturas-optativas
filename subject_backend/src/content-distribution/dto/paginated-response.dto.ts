
import { ApiProperty } from '@nestjs/swagger';
import { ResponseContentDistributionDto } from './response-content-distribution.dto';

export class PaginatedResponseDto {
  @ApiProperty({ description: 'Lista de distribuciones', type: [ResponseContentDistributionDto] })
  data: ResponseContentDistributionDto[];

  @ApiProperty({ description: 'Número total de elementos' })
  total: number;

  @ApiProperty({ description: 'Página actual' })
  page: number;

  @ApiProperty({ description: 'Límite por página' })
  limit: number;

  @ApiProperty({ description: 'Total de páginas' })
  totalPages: number;
}