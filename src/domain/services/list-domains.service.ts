import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, ILike } from 'typeorm';
import { Domain } from '../entities/domain.entity';
import { DomainQueryDto } from '../dto/domain-query.dto';
import { DomainListDto } from '../dto/domain-list.dto';

@Injectable()
export class ListDomainService {
  constructor(
    @InjectRepository(Domain)
    private readonly domainRepository: Repository<Domain>,
  ) {}

  async findAll(query: DomainQueryDto): Promise<DomainListDto> {
    const startTime = Date.now();
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

    const skip = (query.offset ?? 0) * (query.limit ?? 100);

    const filteredCount = await this.domainRepository.count({
      where: filteredWhere,
    });

    const findOptions: FindManyOptions<Domain> = {
      where: filteredWhere,
      relations: relationsToLoad,
      take: query.limit,
      skip,
      select: selectFields,
    };

    const domains = await this.domainRepository.find(findOptions);

    const endTime = Date.now();
    return {
      data: domains,
      filteredCount,
      durationMs: Math.round(endTime - startTime),
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
}
