import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Headers,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InboxService } from '../../common/inbox/inbox.service';
import { VerifyClerkSignatureStrategy } from '../../common/inbox/verify-signature-strategies/verify-clerk-signature.strategy';
import { ConfigService } from '@nestjs/config';

@ApiTags('Webhooks - Clerk')
@Controller('webhooks')
export class WebhooksController {
  constructor(
    private readonly inboxService: InboxService,
    private readonly configService: ConfigService,
  ) {}

  @Post('clerk')
  @HttpCode(HttpStatus.OK)
  async webhook(
    @Body() payload: { type: string; data: Record<string, any> },
    @Headers() headers: Record<string, string>,
  ) {
    const webhookSecret = this.configService.get<string>(
      'CLERK_WEBHOOK_SECRET',
    )!;

    await this.inboxService.receive(
      {
        source: 'clerk',
        payload,
        topic: payload.type,
      },
      new VerifyClerkSignatureStrategy(headers, webhookSecret, payload),
    );
  }
}
