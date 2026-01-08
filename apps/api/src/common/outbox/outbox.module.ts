import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { OutboxService } from './outbox.service';
import { OutboxPublisher } from './outbox.publisher';
import { OutboxCron } from './outbox.cron';

@Module({
  imports: [PrismaModule],
  providers: [OutboxService, OutboxPublisher, OutboxCron],
  exports: [OutboxService],
})
export class OutboxModule {}
