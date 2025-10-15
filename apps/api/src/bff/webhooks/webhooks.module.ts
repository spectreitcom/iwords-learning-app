import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { InboxModule } from '../../common/inbox/inbox.module';

@Module({
  imports: [InboxModule],
  controllers: [WebhooksController],
})
export class WebhooksModule {}
