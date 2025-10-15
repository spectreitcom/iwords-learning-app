import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InboxService } from './inbox.service';

@Injectable()
export class InboxPublisher {
  private running = false;

  constructor(private readonly inboxService: InboxService) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async publish() {
    if (this.running) return;
    this.running = true;
    await this.inboxService.tick();
    this.running = false;
  }
}
