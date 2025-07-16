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
    description:
      'Cursor for pagination, used to fetch the next set of results.',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  nextCursor?: string;

  @ApiProperty({
    description: 'Time taken to execute the query in milliseconds.',
    example: 150,
  })
  durationMs: number;
}
