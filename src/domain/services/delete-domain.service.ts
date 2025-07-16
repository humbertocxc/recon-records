import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Domain } from '../entities/domain.entity';

@Injectable()
export class DeleteDomainService {
  constructor(
    @InjectRepository(Domain)
    private readonly domainRepository: Repository<Domain>,
  ) {}

  async remove(id: string): Promise<void> {
    const result = await this.domainRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Domain with ID "${id}" not found`);
    }
  }
}
