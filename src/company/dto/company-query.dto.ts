import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CompanyQueryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsOptional()
  id?: string;
}
