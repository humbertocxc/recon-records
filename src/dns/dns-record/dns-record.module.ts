import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DnsRecordService } from './dns-record.service';
import { DnsRecordController } from './dns-record.controller';
import { DnsRecord } from './entities/dns-record.entity';
import { IpModule } from '../../ip/ip-address/ip.module';
import { DnsZoneModule } from '../dns-zone/dns-zone.module';

@Module({
  imports: [TypeOrmModule.forFeature([DnsRecord]), DnsZoneModule, IpModule],
  controllers: [DnsRecordController],
  providers: [DnsRecordService],
  exports: [DnsRecordService, TypeOrmModule.forFeature([DnsRecord])],
})
export class DnsRecordModule {}
