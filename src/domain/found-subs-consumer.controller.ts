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

  @EventPattern('found_subs_queue')
  async handleFoundSub(@Payload() data: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    const parsedData: FoundSubDto = JSON.parse(data);

    try {
      this.logger.log(
        `Received message for 'found_subs_queue': ${JSON.stringify(parsedData)}`,
      );
      await this.foundSubsConsumerService.processFoundSubdomain(parsedData);
      this.logger.log(`Successfully processed subdomain: ${parsedData.value}`);

      channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(
        `Error processing message from 'found_subs_queue': ${error.message}`,
        error.stack,
      );
      channel.nack(originalMessage, false, true);
    }
  }
}
