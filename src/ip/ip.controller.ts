import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateIpDto } from './dto/create-ip.dto';
import { CreateIpService } from './services/create-ip.service';
import { UpdateIpDto } from './dto/update-ip.dto';
import { UpdateIpService } from './services/update-ip.service';
import { ListIpsDto } from './dto/list-ips.dto';
import { ListIpsService } from './services/list-ips.service';
import { DeleteIpService } from './services/delete-ip.service';

@Controller('ips')
export class IpController {
  constructor(
    private readonly createIpService: CreateIpService,
    private readonly updateIpService: UpdateIpService,
    private readonly listIpsService: ListIpsService,
    private readonly deleteIpService: DeleteIpService,
  ) {}

  @Post()
  create(@Body() dto: CreateIpDto) {
    return this.createIpService.create(dto);
  }

  @Get()
  findAll(@Param() dto: ListIpsDto) {
    return this.listIpsService.findAll(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listIpsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateIpDto) {
    return this.updateIpService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.deleteIpService.remove(id);
  }
}
