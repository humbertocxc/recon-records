import { Module } from '@nestjs/common';
import { IpController } from './ip.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'src/company/entities/company.entity';
import { IpAddress } from './entities/ip.entity';
import { DnsZone } from 'src/dns/dns-zone/entities/dns-zone.entity';
import { CreateIpService } from './services/create-ip.service';
import { Domain } from 'src/domain/entities/domain.entity';
import { UpdateIpService } from './services/update-ip.service';
import { ListIpsService } from './services/list-ips.service';
import { DeleteIpService } from './services/delete-ip.service';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Domain, IpAddress, DnsZone])],
  controllers: [IpController],
  providers: [
    CreateIpService,
    UpdateIpService,
    ListIpsService,
    DeleteIpService,
  ],
})
export class IpModule {}
