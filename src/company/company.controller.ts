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
  ApiOperation,
  ApiResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { Company } from './entities/company.entity';

@ApiTags('companies')
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new company' })
  @ApiCreatedResponse({
    description: 'The company has been successfully created.',
    type: Company,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data.' })
  async create(@Body() createCompanyDto: CreateCompanyDto): Promise<Company> {
    return this.companyService.create(createCompanyDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve a list of companies, with optional filtering',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filter by company name (partial match)',
  })
  @ApiQuery({
    name: 'description',
    required: false,
    description: 'Filter by company description (partial match)',
  })
  @ApiQuery({
    name: 'id',
    required: false,
    description: 'Filter by company UUID',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved list of companies.',
    type: [Company],
  })
  async findAll(@Query() query: CompanyQueryDto): Promise<Company[]> {
    return this.companyService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single company by ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the company to retrieve',
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
  @ApiOperation({ summary: 'Update an existing company by ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the company to update',
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

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a company by ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the company to delete',
    type: 'string',
  })
  @ApiNoContentResponse({ description: 'Company successfully deleted.' })
  @ApiNotFoundResponse({
    description: 'Company with the specified ID not found.',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.companyService.remove(id);
  }
}
