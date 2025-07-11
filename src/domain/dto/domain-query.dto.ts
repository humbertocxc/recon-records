import { IsString, IsOptional, IsUUID, IsInt, Min } from 'class-validator';
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
  @IsOptional()
  @Type(() => Number)
  offset?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  limit?: number;
}
