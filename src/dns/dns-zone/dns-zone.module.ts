import { Module } from '@nestjs/common';
import { DnsZoneService } from './dns-zone.service';
import { DnsZoneController } from './dns-zone.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DnsZone } from './entities/dns-zone.entity';
import { Domain } from 'src/domain/entities/domain.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DnsZone, Domain])],
  providers: [DnsZoneService],
  controllers: [DnsZoneController],
})
export class DnsZoneModule {}
