import { PartialType, ApiBodyOptions } from '@nestjs/swagger';
import { CreateDnsRecordDto } from './create-dns-record.dto';
import { IsOptional, IsInt, Min, ValidateIf, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DnsRecordType } from '../entities/dns-record.entity';

export class UpdateDnsRecordDto extends PartialType(CreateDnsRecordDto) {
  @ApiProperty({
    description: 'Time-to-Live for the DNS record in seconds.',
    example: 7200,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  ttl?: number;

  @ApiProperty({
    description: 'Priority for MX records.',
    example: 20,
    required: false,
  })
  @ValidateIf((o) => o.type === DnsRecordType.MX)
  @IsOptional()
  @IsInt()
  @Min(0)
  priority?: number;

  @ApiProperty({
    description:
      'ID of the IP address entity (only for A/AAAA records). Can be null to disassociate.',
    example: 'g3h4i5j6-k7l8-9012-3456-7890abcdefg2',
    required: false,
    nullable: true,
  })
  @ValidateIf(
    (o) =>
      o.type === DnsRecordType.A ||
      o.type === DnsRecordType.AAAA ||
      o.ipId !== undefined,
  )
  @IsOptional()
  @IsUUID('all', { message: 'ipId must be a valid UUID' })
  ipId?: string | null;

  static getApiBodyOptions(): ApiBodyOptions {
    return {
      description:
        'Data for updating an existing DNS record. All fields are optional.',
      type: UpdateDnsRecordDto,
      examples: {
        updateValue: {
          summary: 'Update record value',
          value: {
            value: '192.168.1.2',
          },
        },
        updateTtl: {
          summary: 'Update TTL',
          value: {
            ttl: 7200,
          },
        },
        disassociateIp: {
          summary: 'Disassociate IP from an A/AAAA record',
          value: {
            ipId: null,
          },
        },
      },
    };
  }
}
