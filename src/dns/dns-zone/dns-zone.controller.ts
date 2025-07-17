import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DnsZoneService } from './dns-zone.service';
import { CreateDnsZoneDto } from './dto/create-dns-zone.dto';
import { UpdateDnsZoneDto } from './dto/update-dns-zone.dto';

@ApiTags('dns-zones')
@Controller('dns-zones')
export class DnsZoneController {
  constructor(private readonly dnsZoneService: DnsZoneService) {}

  @Post()
  create(@Body() dto: CreateDnsZoneDto) {
    return this.dnsZoneService.create(dto);
  }

  @Get()
  findAll() {
    return this.dnsZoneService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dnsZoneService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDnsZoneDto) {
    return this.dnsZoneService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dnsZoneService.remove(id);
  }
}
