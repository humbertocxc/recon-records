import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DomainService } from './services/domain.service';
import { DomainController } from './domain.controller';
import { Domain } from './entities/domain.entity';
import { Company } from '../company/entities/company.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([Domain, Company]),
    ClientsModule.register([
      {
        name: 'VULN_ENUM_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'domain_to_enum_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [DomainController],
  providers: [DomainService],
})
export class DomainModule {}
