import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateIpAddressDto } from './dto/create-ip.dto';
import { CreateIpAddressService } from './services/create-ip.service';
import { UpdateIpAddressDto } from './dto/update-ip.dto';
import { UpdateIpService } from './services/update-ip.service';
import { ListIpAddressesDto } from './dto/list-ips.dto';
import { DeleteIpService } from './services/delete-ip.service';
import { ListIpAddressesService } from './services/list-ips.service';

@Controller('ips')
export class IpAddressController {
  constructor(
    private readonly createIpService: CreateIpAddressService,
    private readonly updateIpService: UpdateIpService,
    private readonly listIpsService: ListIpAddressesService,
    private readonly deleteIpService: DeleteIpService,
  ) {}

  @Post()
  create(@Body() dto: CreateIpAddressDto) {
    return this.createIpService.create(dto);
  }

  @Get()
  findAll(@Param() dto: ListIpAddressesDto) {
    return this.listIpsService.findAll(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listIpsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateIpAddressDto) {
    return this.updateIpService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.deleteIpService.remove(id);
  }
}
