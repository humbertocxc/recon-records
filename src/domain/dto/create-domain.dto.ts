import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDomainDto {
  @ApiProperty({
    description: 'The name of the domain',
    example: '',
  })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({
    description: 'The name of the domain',
    example: '',
  })
  @IsNumber()
  @IsOptional()
  rank?: number;

  @ApiProperty({
    description: 'The companyId of the domain',
    example: '',
  })
  @IsUUID()
  @IsOptional()
  companyId: string;
}
