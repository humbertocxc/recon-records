import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DnsRecord, DnsRecordType } from './entities/dns-record.entity';
import { CreateDnsRecordDto } from './dto/create-dns-record.dto';
import { UpdateDnsRecordDto } from './dto/update-dns-record.dto';
import { DnsRecordQueryDto } from './dto/dns-record-query.dto';
import { DnsZoneService } from '../dns-zone/dns-zone.service';
import { ListIpAddressesService } from 'src/ip/ip-address/services/list-ips.service';

export enum DnsRecordEvent {
  CREATED = 'dns_record.created',
  UPDATED = 'dns_record.updated',
}

@Injectable()
export class DnsRecordService {
  private readonly logger = new Logger(DnsRecordService.name);

  constructor(
    @InjectRepository(DnsRecord)
    private readonly dnsRecordRepository: Repository<DnsRecord>,
    private readonly dnsZoneService: DnsZoneService,
    private readonly ipService: ListIpAddressesService,
  ) {}

  async createOrUpdate(
    createDnsRecordDto: CreateDnsRecordDto,
  ): Promise<DnsRecord> {
    const { dnsZoneId, ipId, type, name, value, ttl, priority } =
      createDnsRecordDto;

    const dnsZone = await this.dnsZoneService.findOne(dnsZoneId);
    if (!dnsZone) {
      throw new BadRequestException(`DNS Zone with ID ${dnsZoneId} not found.`);
    }

    if (type === DnsRecordType.A || type === DnsRecordType.AAAA) {
      if (!ipId) {
        throw new BadRequestException(
          `IP ID is required for A and AAAA records.`,
        );
      }
      const ip = await this.ipService.findOne(ipId);
      if (!ip) {
        throw new BadRequestException(`IP with ID ${ipId} not found.`);
      }
    } else if (ipId) {
      this.logger.warn(
        `ipId ${ipId} provided for non-A/AAAA record type ${type}. It will be ignored.`,
      );
      createDnsRecordDto.ipId = null;
    }

    const existingRecord = await this.dnsRecordRepository.findOne({
      where: { dnsZoneId, name, type },
    });

    if (existingRecord) {
      let changed = false;
      if (existingRecord.value !== value) {
        existingRecord.value = value;
        changed = true;
      }
      if (existingRecord.ttl !== ttl) {
        existingRecord.ttl = ttl;
        changed = true;
      }
      if (existingRecord.priority !== priority) {
        existingRecord.priority = priority;
        changed = true;
      }
      if (existingRecord.ipId !== ipId) {
        existingRecord.ipId = ipId;
        changed = true;
      }

      const updatedRecord = await this.dnsRecordRepository.save(existingRecord);
      if (changed) {
        this.logger.log(`DNS Record updated: ${updatedRecord.id}`);
      } else {
        this.logger.log(
          `DNS Record already exists and no data changed: ${updatedRecord.id}`,
        );
      }
      return updatedRecord;
    } else {
      const newRecord = this.dnsRecordRepository.create(createDnsRecordDto);
      const savedRecord = await this.dnsRecordRepository.save(newRecord);
      this.logger.log(`DNS Record created: ${savedRecord.id}`);
      return savedRecord;
    }
  }

  async findOne(id: string): Promise<DnsRecord> {
    const record = await this.dnsRecordRepository.findOne({
      where: { id },
      relations: ['dnsZone', 'ip'],
    });
    if (!record) {
      throw new NotFoundException(`DNS Record with ID ${id} not found.`);
    }
    return record;
  }

  async findAll(query: DnsRecordQueryDto): Promise<DnsRecord[]> {
    const { dnsZoneId, ipId, name, value, type } = query;
    const queryBuilder =
      this.dnsRecordRepository.createQueryBuilder('dnsRecord');

    if (dnsZoneId) {
      queryBuilder.andWhere('dnsRecord.dnsZoneId = :dnsZoneId', { dnsZoneId });
    }
    if (ipId) {
      queryBuilder.andWhere('dnsRecord.ipId = :ipId', { ipId });
    }
    if (name) {
      queryBuilder.andWhere('dnsRecord.name ILIKE :name', {
        name: `%${name}%`,
      });
    }
    if (value) {
      queryBuilder.andWhere('dnsRecord.value ILIKE :value', {
        value: `%${value}%`,
      });
    }
    if (type) {
      queryBuilder.andWhere('dnsRecord.type = :type', { type });
    }

    return queryBuilder.getMany();
  }

  async findByCompany(companyId: string): Promise<DnsRecord[]> {
    return this.dnsRecordRepository
      .createQueryBuilder('dnsRecord')
      .innerJoin('dnsRecord.dnsZone', 'dnsZone')
      .innerJoin('dnsZone.domain', 'domain')
      .innerJoin('domain.company', 'company')
      .where('company.id = :companyId', { companyId })
      .getMany();
  }

  async findByDomain(domainId: string): Promise<DnsRecord[]> {
    return this.dnsRecordRepository
      .createQueryBuilder('dnsRecord')
      .innerJoin('dnsRecord.dnsZone', 'dnsZone')
      .innerJoin('dnsZone.domain', 'domain')
      .where('domain.id = :domainId', { domainId })
      .getMany();
  }

  async findByDnsZone(dnsZoneId: string): Promise<DnsRecord[]> {
    return this.dnsRecordRepository.find({
      where: { dnsZoneId },
      relations: ['dnsZone', 'ip'],
    });
  }

  async findByIp(ipId: string): Promise<DnsRecord[]> {
    return this.dnsRecordRepository.find({
      where: { ipId },
      relations: ['dnsZone', 'ip'],
    });
  }

  async update(
    id: string,
    updateDnsRecordDto: UpdateDnsRecordDto,
  ): Promise<DnsRecord> {
    const record = await this.dnsRecordRepository.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(`DNS Record with ID ${id} not found.`);
    }

    if (
      updateDnsRecordDto.dnsZoneId &&
      updateDnsRecordDto.dnsZoneId !== record.dnsZoneId
    ) {
      const dnsZone = await this.dnsZoneService.findOne(
        updateDnsRecordDto.dnsZoneId,
      );
      if (!dnsZone) {
        throw new BadRequestException(
          `DNS Zone with ID ${updateDnsRecordDto.dnsZoneId} not found.`,
        );
      }
    }

    if (updateDnsRecordDto.ipId !== undefined) {
      const targetType = updateDnsRecordDto.type || record.type;
      if (targetType === DnsRecordType.A || targetType === DnsRecordType.AAAA) {
        if (updateDnsRecordDto.ipId === null) {
          throw new BadRequestException(
            `IP ID cannot be null for A and AAAA records.`,
          );
        }
        const ip = await this.ipService.findOne(updateDnsRecordDto.ipId);
        if (!ip) {
          throw new BadRequestException(
            `IP with ID ${updateDnsRecordDto.ipId} not found.`,
          );
        }
      } else if (updateDnsRecordDto.ipId !== null) {
        this.logger.warn(
          `ipId ${updateDnsRecordDto.ipId} provided for non-A/AAAA record type ${targetType}. It will be ignored.`,
        );
        updateDnsRecordDto.ipId = null;
      }
    }

    Object.assign(record, updateDnsRecordDto);
    const updatedRecord = await this.dnsRecordRepository.save(record);
    this.logger.log(`DNS Record updated: ${updatedRecord.id}`);
    return updatedRecord;
  }

  async remove(id: string): Promise<void> {
    const result = await this.dnsRecordRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`DNS Record with ID ${id} not found.`);
    }
    this.logger.log(`DNS Record deleted: ${id}`);
  }
}
