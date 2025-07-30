import {
  IsUUID,
  IsString,
  IsNotEmpty,
  IsEnum,
  IsInt,
  Min,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiBodyOptions } from '@nestjs/swagger';
import { DnsRecordType } from '../entities/dns-record.entity';

export class CreateDnsRecordDto {
  @ApiProperty({
    description: 'Type of the DNS record (e.g., A, AAAA, MX, TXT).',
    enum: DnsRecordType,
    example: DnsRecordType.A,
  })
  @IsEnum(DnsRecordType)
  type: DnsRecordType;

  @ApiProperty({
    description:
      'The name of the DNS record (e.g., www, mail, @, *). This is relative to the DNS zone if not fully qualified.',
    example: 'www',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description:
      'The value of the DNS record (e.g., IP address for A/AAAA, hostname for CNAME/MX/NS, text for TXT).',
    example: '192.168.1.1',
  })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({
    description: 'Time-to-Live for the DNS record in seconds.',
    example: 3600,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  ttl?: number;

  @ApiProperty({
    description: 'Priority for MX records (required if type is MX).',
    example: 10,
    required: false,
  })
  @ValidateIf((o) => o.type === DnsRecordType.MX)
  @IsNotEmpty({ message: 'Priority is required for MX records' })
  @IsInt()
  @Min(0)
  priority?: number;

  @ApiProperty({
    description: 'ID of the DNS Zone this record belongs to.',
    example: 'f2a3b4c5-d6e7-8901-2345-67890abcdef0',
  })
  @IsUUID()
  @IsNotEmpty()
  dnsZoneId: string;

  @ApiProperty({
    description: 'ID of the IP address entity (required if type is A or AAAA).',
    example: 'g3h4i5j6-k7l8-9012-3456-7890abcdefg1',
    required: false,
  })
  @ValidateIf(
    (o) => o.type === DnsRecordType.A || o.type === DnsRecordType.AAAA,
  )
  @IsNotEmpty({ message: 'IP ID is required for A and AAAA records' })
  @IsUUID()
  ipId?: string | null;

  static getApiBodyOptions(): ApiBodyOptions {
    return {
      description: 'Data for creating a new DNS record',
      type: CreateDnsRecordDto,
      examples: {
        aRecord: {
          summary: 'Example A record creation',
          value: {
            type: DnsRecordType.A,
            name: 'www',
            value: '192.168.1.1',
            ttl: 3600,
            dnsZoneId: 'f2a3b4c5-d6e7-8901-2345-67890abcdef0',
            ipId: 'g3h4i5j6-k7l8-9012-3456-7890abcdefg1',
          },
        },
        mxRecord: {
          summary: 'Example MX record creation',
          value: {
            type: DnsRecordType.MX,
            name: '@',
            value: 'mail.example.com',
            ttl: 3600,
            priority: 10,
            dnsZoneId: 'f2a3b4c5-d6e7-8901-2345-67890abcdef0',
          },
        },
        txtRecord: {
          summary: 'Example TXT record creation',
          value: {
            type: DnsRecordType.TXT,
            name: '_dmarc',
            value: 'v=DMARC1; p=none;',
            dnsZoneId: 'f2a3b4c5-d6e7-8901-2345-67890abcdef0',
          },
        },
      },
    };
  }
}
