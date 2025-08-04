import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IpAddress } from '../entities/ip.entity';
import { In, Repository } from 'typeorm';
import { DnsZone } from '../../../dns/dns-zone/entities/dns-zone.entity';
import { Company } from '../../../company/entities/company.entity';
import { Domain } from '../../../domain/entities/domain.entity';
import { UpdateIpAddressDto } from '../dto/update-ip.dto';

@Injectable()
export class UpdateIpService {
  constructor(
    @InjectRepository(IpAddress)
    private readonly ipRepo: Repository<IpAddress>,
    @InjectRepository(Domain)
    private readonly domainRepo: Repository<Domain>,
    @InjectRepository(DnsZone)
    private readonly dnsZoneRepo: Repository<DnsZone>,
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
  ) {}

  async update(ipAddress: string, dto: UpdateIpAddressDto): Promise<IpAddress> {
    const ip = await this.ipRepo.findOneBy({ ip: ipAddress });

    if (!ip) {
      throw new NotFoundException(`IP Address "${ipAddress}" not found.`);
    }

    this.ipRepo.merge(ip, dto);

    if (dto.domainIds !== undefined) {
      ip.domains = dto.domainIds.length
        ? await this.findDomainsByIds(dto.domainIds)
        : [];
    }

    if (dto.dnsZoneId !== undefined) {
      if (dto.dnsZoneId === null) {
        throw new BadRequestException('DNS Zone cannot be set to null.');
      }
      ip.dnsZone = await this.findDnsZoneById(dto.dnsZoneId);
    }

    if (dto.companyId !== undefined) {
      if (dto.companyId === null) {
        throw new BadRequestException('Company cannot be set to null.');
      }
      ip.company = await this.findCompanyById(dto.companyId);
    }

    const updatedIp = await this.ipRepo.save(ip);
    return updatedIp;
  }

  private async findDomainsByIds(ids: string[]): Promise<Domain[]> {
    return this.domainRepo.findBy({ id: In(ids) });
  }

  private async findDnsZoneById(id: string): Promise<DnsZone> {
    const dnsZone = await this.dnsZoneRepo.findOneBy({ id });
    if (!dnsZone) {
      throw new NotFoundException(`DNS Zone with ID ${id} not found.`);
    }
    return dnsZone;
  }

  private async findCompanyById(id: string): Promise<Company> {
    const company = await this.companyRepo.findOneBy({ id });
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found.`);
    }
    return company;
  }
}
