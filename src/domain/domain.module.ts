import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DomainController } from './domain.controller';
import { Domain } from './entities/domain.entity';
import { Company } from '../company/entities/company.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CreateDomainService } from './services/create-domain.service';
import { ListDomainService } from './services/list-domains.service';
import { UpdateDomainService } from './services/update-domain.service';
import { DeleteDomainService } from './services/delete-domain.service';
import { FoundSubsConsumerService } from './services/found-subs-consumer.service';
import { FoundSubsConsumerController } from './found-subs-consumer.controller';
import { IpAddress } from 'src/ip/ip-address/entities/ip.entity';
import { AmqpService } from 'src/common/messaging/amqp.service';
import { RabbitConfigService } from 'src/common/messaging/rabbit-config.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Domain, Company, IpAddress]),
    ClientsModule.register([
      {
        name: 'VULN_ENUM_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'domains_to_passive_enum_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [DomainController, FoundSubsConsumerController],
  providers: [
    CreateDomainService,
    ListDomainService,
    UpdateDomainService,
    DeleteDomainService,
    FoundSubsConsumerService,
    AmqpService,
    RabbitConfigService,
  ],
  exports: [AmqpService],
})
export class DomainModule {}
