import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { OutboxService } from './outbox.service';
import { OutboxPublisher } from './outbox.publisher';
import { OutboxCron } from './outbox.cron';
import { ClockModule } from '../clock/clock.module';
import { LocalOutboxService } from './local-outbox.service';

@Module({
  imports: [PrismaModule, ClockModule],
  providers: [
    {
      provide: OutboxService,
      useClass: LocalOutboxService,
    },
    OutboxPublisher,
    OutboxCron,
  ],
  exports: [OutboxService],
})
export class OutboxModule {}
