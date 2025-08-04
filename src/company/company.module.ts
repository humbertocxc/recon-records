import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { Company } from './entities/company.entity';
import { Domain } from 'src/domain/entities/domain.entity';
import { IpAddress } from 'src/ip/ip-address/entities/ip.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Domain, IpAddress])],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
