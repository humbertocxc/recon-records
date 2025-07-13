import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, ILike } from 'typeorm';
import { Domain } from './entities/domain.entity';
import { Company } from '../company/entities/company.entity';
import { CreateDomainDto } from './dto/create-domain.dto';
import { UpdateDomainDto } from './dto/update-domain.dto';
import { DomainQueryDto } from './dto/domain-query.dto';
import { DomainListDto } from './dto/domain-list.dto';
import { isTargetInScope } from 'src/common/utils/scope-checker.util';

@Injectable()
export class DomainService {
  constructor(
    @InjectRepository(Domain)
    private readonly domainRepository: Repository<Domain>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
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
    return this.domainRepository.save(domain);
  }

  async findAll(query: DomainQueryDto): Promise<DomainListDto> {
    const filteredWhere: Record<string, unknown> = {};
    const relationsToLoad: string[] = [];
    const selectFields: string[] | { [key: string]: any } | undefined =
      undefined;

    if (query.name) {
      filteredWhere.value = ILike(`%${query.name}%`);
    }

    if (query.companyId !== undefined) {
      filteredWhere.companyId = query.companyId;
    }

    if (query.isInScope === 'true' || query.isInScope === 'false') {
      filteredWhere.isInScope = query.isInScope === 'true';
    }

    const totalCount = await this.domainRepository.count({
      where: { companyId: query.companyId },
    });

    const filteredCount = await this.domainRepository.count({
      where: filteredWhere,
    });

    const findOptions: FindManyOptions<Domain> = {
      where: filteredWhere,
      relations: relationsToLoad,
      take: query.limit,
      skip: query.offset,
      select: selectFields,
    };

    const domains = await this.domainRepository.find(findOptions);

    return {
      totalCount,
      filteredCount,
      data: domains,
    };
  }

  async findOne(id: string): Promise<Domain> {
    const domain = await this.domainRepository.findOne({
      where: { id },
      relations: ['company'],
    });
    if (!domain) {
      throw new NotFoundException(`Domain with ID "${id}" not found`);
    }
    return domain;
  }

  async update(id: string, updateDomainDto: UpdateDomainDto): Promise<Domain> {
    const domain = await this.findOne(id);

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

  async remove(id: string): Promise<void> {
    const result = await this.domainRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Domain with ID "${id}" not found`);
    }
  }
}
