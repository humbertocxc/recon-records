import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ListIpsDto {
  @ApiPropertyOptional({
    description: 'Reverse DNS',
    example: 'host.example.com',
  })
  @IsOptional()
  @IsString()
  reverseDns?: string;

  @ApiPropertyOptional({ description: 'Related domain IDs', type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  domainIds?: string[];

  @ApiPropertyOptional({ description: 'DNS Zone ID' })
  @IsOptional()
  @IsUUID()
  dnsZoneId?: string;

  @ApiPropertyOptional({ description: 'Company ID' })
  @IsOptional()
  @IsUUID()
  companyId?: string;
}
