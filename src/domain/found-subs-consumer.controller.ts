import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Ctx, RmqContext, Payload } from '@nestjs/microservices';
import { FoundSubsConsumerService } from './services/found-subs-consumer.service';
import { FoundSubDto } from './dto/found-sub.dto';

@Controller()
export class FoundSubsConsumerController {
  private readonly logger = new Logger(FoundSubsConsumerController.name);

  constructor(
    private readonly foundSubsConsumerService: FoundSubsConsumerService,
  ) {}

  @EventPattern('passive_found_subs_queue')
  async handlePassiveFoundSub(
    @Payload() data: FoundSubDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      this.logger.log(
        `Received message for 'passive_found_subs_queue': ${JSON.stringify(data)}`,
      );
      await this.foundSubsConsumerService.processFoundSubdomain(data);
      this.logger.log(`Successfully processed subdomain: ${data.value}`);

      channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(
        `Error processing message from 'passive_found_subs_queue': ${error.message}`,
        error.stack,
      );
      channel.nack(originalMessage, false, true);
    }
  }
}
