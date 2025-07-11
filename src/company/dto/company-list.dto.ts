import { ApiProperty } from '@nestjs/swagger';
import { Company } from '../entities/company.entity';

export class CompanyListDto {
  @ApiProperty({
    description: 'Total number of companies available in the system.',
    example: 100,
  })
  totalCount: number;

  @ApiProperty({
    description: 'Total number of companies matching the filter criteria.',
    example: 50,
  })
  filteredCount: number;

  @ApiProperty({
    type: [Company],
    description: 'Array of company objects.',
  })
  data: Company[];
}
