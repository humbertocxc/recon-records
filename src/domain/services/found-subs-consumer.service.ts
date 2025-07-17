import { Injectable, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Domain } from '../entities/domain.entity';
import { Company } from '../../company/entities/company.entity';
import { FoundSubDto } from '../dto/found-sub.dto';

@Injectable()
export class FoundSubsConsumerService {
  private readonly logger = new Logger(FoundSubsConsumerService.name);

  constructor(
    @InjectRepository(Domain)
    private readonly domainRepository: Repository<Domain>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  @EventPattern('passive_found_subs_queue')
  async processFoundSubdomain(@Payload() data: FoundSubDto) {
    const { value, companyId } = data;
    if (!value || !companyId) {
      this.logger.warn('Invalid message received:', data);
      return;
    }
    const company = await this.companyRepository.findOneBy({ id: companyId });
    if (!company) {
      this.logger.warn(`Company with ID ${companyId} not found.`);
      return;
    }
    const existing = await this.domainRepository.findOneBy({
      value,
    });
    if (existing) {
      this.logger.log(
        `Domain '${value}' already exists for company ${companyId}.`,
      );
      return;
    }
    const domain = this.domainRepository.create({
      value,
      company,
      isInScope: true,
    });
    await this.domainRepository.save(domain);
    this.logger.log(`Created new domain '${value}' for company ${companyId}.`);
  }
}
