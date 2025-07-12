import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty({
    description: 'The name of the company',
    example: '',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'A brief description of the company',
    example: '',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description:
      'An array of strings representing the scope (domains, IPs, wildcards).',
    type: [String],
    example: ['example.com', '192.168.1.1', '*.test.com'],
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  scope?: string[];
}
