import { ArrayNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateDomainDto } from './create-domain.dto';

export class CreateMultipleDomainsDto {
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateDomainDto)
  domains: CreateDomainDto[];
}
