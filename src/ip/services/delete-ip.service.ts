import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IpAddress } from '../entities/ip.entity';
import { Repository } from 'typeorm';
import { ListIpsService } from './list-ips.service';

@Injectable()
export class DeleteIpService {
  constructor(
    @InjectRepository(IpAddress)
    private ipRepo: Repository<IpAddress>,
    private readonly listIpsService: ListIpsService,
  ) {}

  async remove(id: string): Promise<void> {
    const ip = await this.listIpsService.findOne(id);
    if (!ip) throw new NotFoundException();

    await this.ipRepo.remove(ip);
  }
}
