import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CompanyModule } from './company/company.module';
import { DomainModule } from './domain/domain.module';
import { Company } from './company/entities/company.entity';
import { Domain } from './domain/entities/domain.entity';
import { DnsZoneModule } from './dns/dns-zone/dns-zone.module';
import { DnsRecordModule } from './dns/dns-record/dns-record.module';
import { IpModule } from './ip/ip.module';
import { RabbitConfigService } from './common/messaging/rabbit-config.service';
import { DnsRecordController } from './dns/dns-record/dns-record.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Company, Domain],
      synchronize: true,
      autoLoadEntities: true,
    }),
    DomainModule,
    IpModule,
    DnsZoneModule,
    CompanyModule,
    DnsRecordModule,
  ],
  providers: [RabbitConfigService],
  exports: [RabbitConfigService],
  controllers: [DnsRecordController],
})
export class AppModule {}
