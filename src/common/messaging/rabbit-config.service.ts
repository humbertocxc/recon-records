import { INestApplication, Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

interface QueueConfig {
  queueName: string;
  noAck?: boolean;
  durable?: boolean;
}

@Injectable()
export class RabbitConfigService {
  private readonly logger = new Logger(RabbitConfigService.name);

  private readonly queues: QueueConfig[] = [
    { queueName: 'passive_found_subs_queue', durable: true, noAck: false },
  ];

  async registerMicroservices(app: INestApplication) {
    for (const { queueName, durable = true, noAck = false } of this.queues) {
      this.logger.log(`Registering RMQ microservice for queue: ${queueName}`);

      app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'],
          queue: queueName,
          queueOptions: { durable },
          noAck,
        },
      });
    }

    await app.startAllMicroservices();
    this.logger.log(`All RabbitMQ microservices started.`);
  }
}
