import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Domain } from '../entities/domain.entity';
import { Company } from '../../company/entities/company.entity';
import { UpdateDomainDto } from '../dto/update-domain.dto';
import { ListDomainService } from './list-domains.service';

@Injectable()
export class UpdateDomainService {
  constructor(
    @InjectRepository(Domain)
    private readonly domainRepository: Repository<Domain>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly listDomainService: ListDomainService,
  ) {}

  async update(id: string, updateDomainDto: UpdateDomainDto): Promise<Domain> {
    const domain = await this.listDomainService.findOne(id);

    if (updateDomainDto.companyId) {
      const newCompany = await this.companyRepository.findOneBy({
        id: updateDomainDto.companyId,
      });
      if (!newCompany) {
        throw new NotFoundException(
          `Company with ID "${updateDomainDto.companyId}" not found`,
        );
      }
      domain.company = newCompany;
    }

    this.domainRepository.merge(domain, updateDomainDto);
    return this.domainRepository.save(domain);
  }
}
