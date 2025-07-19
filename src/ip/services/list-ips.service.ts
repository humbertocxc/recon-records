import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IpAddress } from '../entities/ip.entity';
import { Repository } from 'typeorm';
import { ListIpsDto } from '../dto/list-ips.dto';

@Injectable()
export class ListIpsService {
  constructor(
    @InjectRepository(IpAddress)
    private ipRepo: Repository<IpAddress>,
  ) {}

  async findAll(query: ListIpsDto): Promise<IpAddress[]> {
    console.log(query);
    return this.ipRepo.find({ relations: ['domains', 'dnsZone', 'company'] });
  }

  async findOne(id: string): Promise<IpAddress | null> {
    return this.ipRepo.findOne({
      where: { id },
      relations: ['domains', 'dnsZone', 'company'],
    });
  }
}
