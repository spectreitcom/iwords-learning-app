import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { OutboxService } from './outbox.service';
import { OutboxPublisher } from './outbox.publisher';
import { OutboxCron } from './outbox.cron';
import { ClockModule } from '../clock/clock.module';

@Module({
  imports: [PrismaModule, ClockModule],
  providers: [OutboxService, OutboxPublisher, OutboxCron],
  exports: [OutboxService],
})
export class OutboxModule {}
