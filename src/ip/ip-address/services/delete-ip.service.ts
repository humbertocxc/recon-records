import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IpAddress } from '../entities/ip.entity';
import { Repository } from 'typeorm';
import { ListIpAddressesService } from './list-ips.service';

@Injectable()
export class DeleteIpService {
  constructor(
    @InjectRepository(IpAddress)
    private ipRepo: Repository<IpAddress>,
    private readonly listIpAddressesService: ListIpAddressesService,
  ) {}

  async remove(id: string): Promise<void> {
    const ip = await this.listIpAddressesService.findOne(id);
    if (!ip) throw new NotFoundException();

    await this.ipRepo.remove(ip);
  }
}
