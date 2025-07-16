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
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyQueryDto } from './dto/company-query.dto';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { Company } from './entities/company.entity';
import { CompanyListDto } from './dto/company-list.dto';

@ApiTags('companies')
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The company has been successfully created.',
    type: Company,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data.' })
  async create(@Body() createCompanyDto: CreateCompanyDto): Promise<Company> {
    return this.companyService.create(createCompanyDto);
  }

  @Get()
  @ApiOkResponse({
    type: [Company],
  })
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
  })
  findAll(@Query() query: CompanyQueryDto): Promise<CompanyListDto> {
    return this.companyService.findAll(query);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
  })
  @ApiOkResponse({
    description: 'Company found and retrieved successfully.',
    type: Company,
  })
  @ApiNotFoundResponse({
    description: 'Company with the specified ID not found.',
  })
  async findOne(@Param('id') id: string): Promise<Company> {
    return this.companyService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
  })
  @ApiOkResponse({
    description: 'Company updated successfully.',
    type: Company,
  })
  @ApiNotFoundResponse({
    description: 'Company with the specified ID not found.',
  })
  @ApiBadRequestResponse({ description: 'Invalid input data for update.' })
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    return this.companyService.update(id, updateCompanyDto);
  }

  @Delete(':id/:newCompanyId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({
    name: 'id',
    type: 'string',
  })
  @ApiParam({
    name: 'newCompanyId',
    description: 'The UUID of the new company to receive the domains',
    type: 'string',
  })
  @ApiNoContentResponse({ description: 'Company successfully deleted.' })
  @ApiNotFoundResponse({
    description: 'Company with the specified ID not found.',
  })
  async remove(
    @Param('id') id: string,
    @Param('newCompanyId') newCompanyId: string,
  ): Promise<void> {
    return this.companyService.remove(id, newCompanyId);
  }
}
