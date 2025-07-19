import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Domain } from '../entities/domain.entity';
import { Company } from '../../company/entities/company.entity';
import { CreateDomainDto } from '../dto/create-domain.dto';
import { isDomainInScope } from 'src/common/utils/scope-checker-domain.util';
import { AmqpService } from 'src/common/messaging/amqp.service';

@Injectable()
export class CreateDomainService {
  constructor(
    @InjectRepository(Domain)
    private readonly domainRepository: Repository<Domain>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly amqpService: AmqpService,
  ) {}

  async create(createDomainDto: CreateDomainDto): Promise<Domain> {
    const company = await this.companyRepository.findOneBy({
      id: createDomainDto.companyId,
    });

    if (!company) {
      throw new NotFoundException(
        `Company with ID "${createDomainDto.companyId}" not found`,
      );
    }

    const isInScope = isDomainInScope(createDomainDto.value, company.scope);

    const domain = this.domainRepository.create({
      ...createDomainDto,
      company,
      isInScope,
    });

    const savedDomain = await this.domainRepository.save(domain);

    if (!savedDomain.value || !savedDomain.companyId) {
      console.warn('Created domain has no value to publish for enumeration.');
      return savedDomain;
    }

    const domainToPublish = {
      value: savedDomain.value,
      companyId: savedDomain.companyId,
    };
    try {
      await this.amqpService.emit(
        'domains_to_passive_enum_queue',
        domainToPublish,
      );
      console.log(
        `Published new domain '${savedDomain.value}' for vulnerability enumeration.`,
      );
    } catch (error) {
      console.error(
        `Failed to publish domain '${savedDomain.value}' to queue:`,
        error,
      );
    }

    return savedDomain;
  }
}
