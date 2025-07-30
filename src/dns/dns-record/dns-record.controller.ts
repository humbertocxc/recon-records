import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DnsRecordService } from './dns-record.service';
import { CreateDnsRecordDto } from './dto/create-dns-record.dto';
import { UpdateDnsRecordDto } from './dto/update-dns-record.dto';
import { DnsRecordQueryDto } from './dto/dns-record-query.dto';
import { DnsRecord } from './entities/dns-record.entity';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiParam,
  ApiBody,
  ApiExtraModels,
} from '@nestjs/swagger';

@ApiTags('dns-records')
@Controller('dns-records')
@ApiExtraModels(DnsRecord)
export class DnsRecordController {
  constructor(private readonly dnsRecordService: DnsRecordService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBody(CreateDnsRecordDto.getApiBodyOptions())
  @ApiCreatedResponse({
    description: '',
    type: DnsRecord,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or related entity not found.',
  })
  async createOrUpdate(
    @Body() createDnsRecordDto: CreateDnsRecordDto,
  ): Promise<DnsRecord> {
    return this.dnsRecordService.createOrUpdate(createDnsRecordDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'Successfully retrieved DNS records.',
    type: [DnsRecord],
  })
  async findAll(@Query() query: DnsRecordQueryDto): Promise<DnsRecord[]> {
    return this.dnsRecordService.findAll(query);
  }

  @Get('by-company/:companyId')
  @ApiParam({
    name: 'companyId',
    type: 'string',
    description: 'UUID of the company to fetch DNS records for.',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved DNS records by company.',
    type: [DnsRecord],
  })
  @ApiNotFoundResponse({
    description:
      'Company with the specified ID not found or no records associated.',
  })
  async findByCompany(
    @Param('companyId') companyId: string,
  ): Promise<DnsRecord[]> {
    return this.dnsRecordService.findByCompany(companyId);
  }

  @Get('by-domain/:domainId')
  @ApiParam({
    name: 'domainId',
    type: 'string',
    description: 'UUID of the domain to fetch DNS records for.',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved DNS records by domain.',
    type: [DnsRecord],
  })
  @ApiNotFoundResponse({
    description:
      'Domain with the specified ID not found or no records associated.',
  })
  async findByDomain(
    @Param('domainId') domainId: string,
  ): Promise<DnsRecord[]> {
    return this.dnsRecordService.findByDomain(domainId);
  }

  @Get('by-zone/:dnsZoneId')
  @ApiParam({
    name: 'dnsZoneId',
    type: 'string',
    description: 'UUID of the DNS zone to fetch records for.',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved DNS records by zone.',
    type: [DnsRecord],
  })
  @ApiNotFoundResponse({
    description:
      'DNS Zone with the specified ID not found or no records associated.',
  })
  async findByDnsZone(
    @Param('dnsZoneId') dnsZoneId: string,
  ): Promise<DnsRecord[]> {
    return this.dnsRecordService.findByDnsZone(dnsZoneId);
  }

  @Get('by-ip/:ipId')
  @ApiParam({
    name: 'ipId',
    type: 'string',
    description:
      'UUID of the IP address to fetch associated DNS records for (A/AAAA types).',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved DNS records by IP address.',
    type: [DnsRecord],
  })
  @ApiNotFoundResponse({
    description: 'IP with the specified ID not found or no records associated.',
  })
  async findByIp(@Param('ipId') ipId: string): Promise<DnsRecord[]> {
    return this.dnsRecordService.findByIp(ipId);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'UUID of the DNS record to retrieve.',
  })
  @ApiOkResponse({
    description: 'DNS Record found and retrieved successfully.',
    type: DnsRecord,
  })
  @ApiNotFoundResponse({
    description: 'DNS Record with the specified ID not found.',
  })
  async findOne(@Param('id') id: string): Promise<DnsRecord> {
    return this.dnsRecordService.findOne(id);
  }

  @Patch(':id')
  @ApiBody(UpdateDnsRecordDto.getApiBodyOptions())
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'UUID of the DNS record to update.',
  })
  @ApiOkResponse({
    description: 'DNS Record updated successfully.',
    type: DnsRecord,
  })
  @ApiNotFoundResponse({
    description: 'DNS Record with the specified ID not found.',
  })
  @ApiBadRequestResponse({ description: 'Invalid input data for update.' })
  async update(
    @Param('id') id: string,
    @Body() updateDnsRecordDto: UpdateDnsRecordDto,
  ): Promise<DnsRecord> {
    return this.dnsRecordService.update(id, updateDnsRecordDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'UUID of the DNS record to delete.',
  })
  @ApiNoContentResponse({ description: 'DNS Record successfully deleted.' })
  @ApiNotFoundResponse({
    description: 'DNS Record with the specified ID not found.',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.dnsRecordService.remove(id);
  }
}
