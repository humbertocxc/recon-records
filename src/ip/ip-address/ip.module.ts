import { Module } from '@nestjs/common';
import { IpAddressController } from './ip.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'src/company/entities/company.entity';
import { IpAddress } from './entities/ip.entity';
import { DnsZone } from 'src/dns/dns-zone/entities/dns-zone.entity';
import { CreateIpAddressService } from './services/create-ip.service';
import { Domain } from 'src/domain/entities/domain.entity';
import { UpdateIpService } from './services/update-ip.service';
import { ListIpAddressesService } from './services/list-ips.service';
import { DeleteIpService } from './services/delete-ip.service';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Domain, IpAddress, DnsZone])],
  controllers: [IpAddressController],
  providers: [
    CreateIpAddressService,
    UpdateIpService,
    ListIpAddressesService,
    DeleteIpService,
  ],
  exports: [ListIpAddressesService],
})
export class IpModule {}
