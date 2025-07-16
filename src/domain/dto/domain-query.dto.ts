import {
  IsString,
  IsOptional,
  IsUUID,
  IsInt,
  Min,
  IsIn,
} from 'class-validator';

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

  @IsOptional()
  @IsIn(['true', 'false'])
  isInScope?: string;

  @IsUUID()
  @IsOptional()
  companyUuid?: string;

  @IsOptional()
  @IsUUID()
  cursor?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}
