import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateDnsZoneDto {
  @ApiProperty({
    description: 'List of nameservers for this DNS zone',
    example: ['ns1.example.com', 'ns2.example.com'],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  nameservers?: string[];

  @ApiProperty({
    description: 'The SOA (Start of Authority) record for the zone',
    example:
      'ns1.example.com hostmaster.example.com 2025071601 7200 3600 1209600 3600',
    required: false,
  })
  @IsString()
  @IsOptional()
  soaRecord?: string;

  @ApiProperty({
    description: 'Registrar name from WHOIS (if available)',
    example: 'Namecheap, Inc.',
    required: false,
  })
  @IsString()
  @IsOptional()
  whoisRegistrar?: string;

  @ApiProperty({
    description: 'Status of the DNS zone',
    example: 'inactive',
    required: false,
    enum: ['active', 'inactive', 'unknown'],
  })
  @IsIn(['active', 'inactive', 'unknown'])
  @IsOptional()
  status?: 'active' | 'inactive' | 'unknown';
}
