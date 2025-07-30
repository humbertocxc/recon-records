import { IsString, IsNotEmpty, IsUUID, IsFQDN } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDomainDto {
  @ApiProperty({
    description: 'The name of the domain',
    example: '',
  })
  @IsString()
  @IsNotEmpty()
  @IsFQDN(
    {
      require_tld: true,
      allow_underscores: false,
      allow_trailing_dot: false,
      allow_numeric_tld: false,
    },
    {
      message:
        'Domain value must be a valid fully qualified domain name (e.g., example.com).',
    },
  )
  value: string;

  @ApiProperty({
    description: 'The companyId of the domain',
    example: '',
  })
  @IsUUID()
  @IsNotEmpty({ message: 'Company ID cannot be empty.' })
  companyId: string;
}
