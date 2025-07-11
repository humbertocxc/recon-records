import { ArrayNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateDomainDto } from './create-domain.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMultipleDomainsDto {
  @ApiProperty({
    description: 'An array of domain objects to be created.',
    type: () => CreateDomainDto,
    isArray: true,
  })
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateDomainDto)
  domains: CreateDomainDto[];
}
