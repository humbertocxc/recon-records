import {
  IsArray,
  IsEnum,
  IsIP,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateIpDto {
  @ApiProperty({ example: '' })
  @IsIP()
  ip: string;

  @ApiProperty({ enum: ['IPv4', 'IPv6'], example: 'IPv4' })
  @IsEnum(['IPv4', 'IPv6'])
  type: 'IPv4' | 'IPv6';

  @ApiPropertyOptional({
    example: '',
  })
  @IsOptional()
  @IsString()
  reverseDns?: string;

  @ApiPropertyOptional({
    type: [String],
    example: [''],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  domainIds?: string[];

  @ApiPropertyOptional({
    example: '',
  })
  @IsOptional()
  @IsUUID()
  dnsZoneId?: string;

  @ApiPropertyOptional({
    example: '',
  })
  @IsOptional()
  @IsUUID()
  companyId?: string;

  @ApiPropertyOptional({
    example: '',
  })
  @IsOptional()
  @IsString()
  source?: string;
}
