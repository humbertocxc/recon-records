import { PartialType } from '@nestjs/swagger';
import { CreateIpDto } from './create-ip.dto';

export class UpdateIpDto extends PartialType(CreateIpDto) {}
