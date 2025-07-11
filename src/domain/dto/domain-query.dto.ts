import {
  IsString,
  IsOptional,
  IsUUID,
  IsInt,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class DomainQueryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsUUID()
  @IsOptional()
  companyId?: string;

  @IsString()
  @IsOptional()
  companyName?: string;

  @IsString()
  @IsOptional()
  companyDescription?: string;

  @IsUUID()
  @IsOptional()
  companyUuid?: string;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  @Type(() => Number)
  offset?: number;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  @Type(() => Number)
  limit?: number;
}
