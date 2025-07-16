import { ApiProperty } from '@nestjs/swagger';
import { Domain } from '../entities/domain.entity';

export class DomainListDto {
  @ApiProperty({
    type: [Domain],
    description: 'Array of company objects.',
  })
  data: Domain[];

  @ApiProperty({
    description: 'Total number of domains matching the filter criteria.',
    example: 50,
  })
  filteredCount: number;

  @ApiProperty({
    description: 'Time taken to execute the query in milliseconds.',
    example: 150,
  })
  durationMs: number;
}
