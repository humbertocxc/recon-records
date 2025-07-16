import { ApiProperty } from '@nestjs/swagger';

export class FoundSubDto {
  @ApiProperty({ description: 'Domain value', example: 'example.com' })
  value: string;

  @ApiProperty({ description: 'Company ID', example: 'uuid-company-id' })
  companyId: string;
}
