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
import { CreateDomainDto } from './dto/create-domain.dto';
import { UpdateDomainDto } from './dto/update-domain.dto';
import { DomainQueryDto } from './dto/domain-query.dto';
import {
  ApiTags,
  ApiResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { Domain } from './entities/domain.entity';
import { ListDomainService } from './services/list-domains.service';
import { CreateDomainService } from './services/create-domain.service';
import { UpdateDomainService } from './services/update-domain.service';
import { DeleteDomainService } from './services/delete-domain.service';

@ApiTags('domains')
@Controller('domains')
export class DomainController {
  constructor(
    private readonly listDomainService: ListDomainService,
    private readonly createDomainService: CreateDomainService,
    private readonly updateDomainService: UpdateDomainService,
    private readonly deleteDomainService: DeleteDomainService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    type: Domain,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data.' })
  create(@Body() createDomainDto: CreateDomainDto) {
    return this.createDomainService.create(createDomainDto);
  }

  @Get()
  @ApiOkResponse({
    type: [Domain],
  })
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'companyId',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'isInScope',
    required: false,
    type: Boolean,
  })
  findAll(@Query() query: DomainQueryDto) {
    return this.listDomainService.findAll(query);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
  })
  @ApiOkResponse({
    type: Domain,
  })
  findOne(@Param('id') id: string) {
    return this.listDomainService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or invalid UUID format.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Domain with the updated name already exists.',
  })
  update(@Param('id') id: string, @Body() updateDomainDto: UpdateDomainDto) {
    return this.updateDomainService.update(id, updateDomainDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({
    name: 'id',
    description: 'The UUID of the domain to delete',
    type: String,
  })
  @ApiNoContentResponse({ description: 'Domain successfully deleted.' })
  @ApiNotFoundResponse({
    description: 'Domain with the specified ID not found.',
  })
  @ApiBadRequestResponse({ description: 'Invalid UUID format for domain ID.' })
  remove(@Param('id') id: string) {
    return this.deleteDomainService.remove(id);
  }
}
