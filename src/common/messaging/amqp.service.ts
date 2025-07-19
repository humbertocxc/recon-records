import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AmqpService {
  private readonly logger = new Logger(AmqpService.name);

  constructor(
    @Inject('VULN_ENUM_SERVICE') private readonly client: ClientProxy,
  ) {}

  async emit<T>(pattern: string, data: T): Promise<void> {
    try {
      await lastValueFrom(this.client.emit(pattern, data));
      this.logger.log(`Message emitted to pattern "${pattern}"`);
    } catch (error) {
      this.logger.error(
        `Failed to emit message to pattern "${pattern}"`,
        error,
      );
      throw error;
    }
  }
}
