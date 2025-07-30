import { IsUUID, IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DnsRecordType } from '../entities/dns-record.entity';

export class DnsRecordQueryDto {
  @ApiProperty({
    description: 'Filter records by DNS zone ID.',
    example: '',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  dnsZoneId?: string;

  @ApiProperty({
    description: 'Filter records by IP ID (for A/AAAA records).',
    example: '',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  ipId?: string;

  @ApiProperty({
    description: 'Filter records by their name (e.g., www, @).',
    example: '',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Filter records by their value (e.g., IP address, hostname).',
    example: '',
    required: false,
  })
  @IsOptional()
  @IsString()
  value?: string;

  @ApiProperty({
    description: 'Filter records by type (e.g., A, MX, TXT).',
    enum: DnsRecordType,
    example: DnsRecordType.A,
    required: false,
  })
  @IsOptional()
  @IsEnum(DnsRecordType)
  type?: DnsRecordType;
}
