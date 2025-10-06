import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { OutboxService } from './outbox.service';
import { OutboxPublisher } from './outbox.publisher';

@Module({
  imports: [PrismaModule],
  providers: [OutboxService, OutboxPublisher],
  exports: [OutboxService],
})
export class OutboxModule {}
