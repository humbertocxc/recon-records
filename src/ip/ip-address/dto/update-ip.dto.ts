import { PartialType } from '@nestjs/swagger';
import { CreateIpAddressDto } from './create-ip.dto';

export class UpdateIpAddressDto extends PartialType(CreateIpAddressDto) {}
