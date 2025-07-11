import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, ILike } from 'typeorm';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyQueryDto } from './dto/company-query.dto';
import { CompanyListDto } from './dto/company-list.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const company = this.companyRepository.create(createCompanyDto);
    return this.companyRepository.save(company);
  }

  async findAll(query: CompanyQueryDto): Promise<CompanyListDto> {
    const where: Record<string, unknown> = {};
    const relationsToLoad: string[] = [];
    const selectFields: string[] | { [key: string]: any } | undefined =
      undefined;

    if (query.name) {
      where.name = ILike(`%${query.name}%`);
    }

    const findOptions: FindManyOptions<Company> = {
      where,
      relations: relationsToLoad,
      take: query.limit,
      skip: query.offset,
      select: selectFields,
    };

    const [companies, filteredCount] =
      await this.companyRepository.findAndCount(findOptions);

    const totalCount = await this.companyRepository.count();

    return {
      totalCount,
      filteredCount,
      data: companies,
    };
  }

  async findOne(id: string): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { id },
      relations: [],
    });

    if (!company) {
      throw new NotFoundException(`Company with ID "${id}" not found`);
    }
    return company;
  }

  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    const company = await this.findOne(id);
    this.companyRepository.merge(company, updateCompanyDto);
    return this.companyRepository.save(company);
  }

  async remove(id: string): Promise<void> {
    const result = await this.companyRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Company with ID "${id}" not found`);
    }
  }
}
