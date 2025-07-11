import { ApiProperty } from '@nestjs/swagger';
import { Domain } from '../entities/domain.entity';

export class DomainListDto {
  @ApiProperty({
    description: 'Total number of domains available for the company.',
    example: 100,
  })
  totalCount: number;

  @ApiProperty({
    description: 'Total number of domains matching the filter criteria.',
    example: 50,
  })
  filteredCount: number;

  @ApiProperty({
    type: [Domain],
    description: 'Array of company objects.',
  })
  data: Domain[];
}
