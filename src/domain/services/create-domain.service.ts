import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Domain } from '../entities/domain.entity';
import { Company } from '../../company/entities/company.entity';
import { CreateDomainDto } from '../dto/create-domain.dto';
import { isTargetInScope } from 'src/common/utils/scope-checker.util';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CreateDomainService {
  constructor(
    @InjectRepository(Domain)
    private readonly domainRepository: Repository<Domain>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @Inject('VULN_ENUM_SERVICE') private readonly client: ClientProxy,
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

    const isInScope = isTargetInScope(createDomainDto.value, company.scope);

    const domain = this.domainRepository.create({
      ...createDomainDto,
      company,
      isInScope,
    });

    const savedDomain = await this.domainRepository.save(domain);

    try {
      if ((savedDomain.value, savedDomain.companyId)) {
        const domainToPublish = {
          value: savedDomain.value,
          companyId: savedDomain.companyId,
        };
        await lastValueFrom(
          this.client.emit(
            'domain_to_enum_queue',
            JSON.stringify(domainToPublish),
          ),
        );
        console.log(
          `Published new domain '${savedDomain.value}' for vulnerability enumeration.`,
        );
      } else {
        console.warn('Created domain has no value to publish for enumeration.');
      }
    } catch (error) {
      console.error(
        `Failed to publish domain '${savedDomain.value}' to queue:`,
        error,
      );
    }

    return savedDomain;
  }
}
