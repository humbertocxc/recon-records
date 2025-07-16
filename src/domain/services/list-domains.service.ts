import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
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

    const limit = query.limit ?? 100;
    const filteredWhere: Record<string, unknown> = {};

    if (query.name) {
      filteredWhere.value = ILike(`%${query.name}%`);
    }

    if (query.companyId !== undefined) {
      filteredWhere.companyId = query.companyId;
    }

    if (query.isInScope === 'true' || query.isInScope === 'false') {
      filteredWhere.isInScope = query.isInScope === 'true';
    }

    const qb = this.domainRepository
      .createQueryBuilder('domain')
      .where(filteredWhere)
      .orderBy('domain.id', 'ASC')
      .take(limit + 1);

    if (query.cursor) {
      qb.andWhere('domain.id > :cursor', { cursor: query.cursor });
    }

    const domains = await qb.getMany();

    let nextCursor: string | undefined = undefined;

    if (domains.length > limit) {
      const nextItem = domains.pop();
      nextCursor = nextItem!.id;
    }

    const filteredCount = await this.domainRepository.count({
      where: filteredWhere,
    });

    const endTime = Date.now();

    return {
      data: domains,
      filteredCount,
      durationMs: Math.round(endTime - startTime),
      nextCursor,
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
