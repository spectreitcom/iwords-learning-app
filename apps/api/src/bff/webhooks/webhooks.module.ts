import { Module } from '@nestjs/common';
import { ClerkWebhookController } from './clerk-webhook.controller';

@Module({
  imports: [],
  controllers: [ClerkWebhookController],
  providers: [],
})
export class WebhooksModule {}
