import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DnsZone } from './entities/dns-zone.entity';
import { Domain } from 'src/domain/entities/domain.entity';
import { CreateDnsZoneDto } from './dto/create-dns-zone.dto';
import { UpdateDnsZoneDto } from './dto/update-dns-zone.dto';

@Injectable()
export class DnsZoneService {
  constructor(
    @InjectRepository(DnsZone)
    private dnsZoneRepo: Repository<DnsZone>,

    @InjectRepository(Domain)
    private domainRepo: Repository<Domain>,
  ) {}

  async create(createDto: CreateDnsZoneDto): Promise<DnsZone> {
    const domain = await this.domainRepo.findOne({
      where: { id: createDto.domainId },
    });

    if (!domain) {
      throw new NotFoundException(`Domain ${createDto.domainId} not found`);
    }

    const zone = this.dnsZoneRepo.create({
      ...createDto,
      domain,
    });

    return this.dnsZoneRepo.save(zone);
  }

  async findAll(): Promise<DnsZone[]> {
    return this.dnsZoneRepo.find({ relations: ['domain'] });
  }

  async findOne(id: string): Promise<DnsZone> {
    const zone = await this.dnsZoneRepo.findOne({
      where: { id },
      relations: ['domain'],
    });
    if (!zone) throw new NotFoundException(`DNS Zone ${id} not found`);
    return zone;
  }

  async update(id: string, updateDto: UpdateDnsZoneDto): Promise<DnsZone> {
    const zone = await this.findOne(id);
    Object.assign(zone, updateDto);
    return this.dnsZoneRepo.save(zone);
  }

  async remove(id: string): Promise<void> {
    const zone = await this.findOne(id);
    await this.dnsZoneRepo.remove(zone);
  }
}
