import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IpAddress } from '../entities/ip.entity';
import { In, Repository } from 'typeorm';
import { DnsZone } from '../../dns/dns-zone/entities/dns-zone.entity';
import { Company } from '../../company/entities/company.entity';
import { CreateIpDto } from '../dto/create-ip.dto';
import { Domain } from '../../domain/entities/domain.entity';

@Injectable()
export class CreateIpService {
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

  async create(dto: CreateIpDto): Promise<IpAddress> {
    const ip = this.ipRepo.create(dto);

    if (dto.dnsZoneId) {
      ip.dnsZone = await this.findDnsZoneById(dto.dnsZoneId);
    }

    if (dto.companyId) {
      ip.company = await this.findCompanyById(dto.companyId);
    }

    const savedIp = await this.ipRepo.save(ip);

    if (dto.domainIds?.length) {
      const domains = await this.findDomainsByIds(dto.domainIds);
      if (domains.length !== dto.domainIds.length) {
        throw new NotFoundException('One or more domains not found.');
      }
      savedIp.domains = domains;
      await this.ipRepo.save(savedIp);
    }

    const result = await this.ipRepo.findOne({
      where: { id: savedIp.id },
      relations: ['company', 'dnsZone', 'domains'],
    });

    if (!result) {
      throw new NotFoundException(
        `IP with ID ${savedIp.id} not found after creation.`,
      );
    }

    return result;
  }

  private async findDomainsByIds(ids: string[]): Promise<Domain[]> {
    return await this.domainRepo.findBy({ id: In(ids) });
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
