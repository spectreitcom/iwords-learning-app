import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Webhooks - Clerk')
@Controller('webhooks/clerk')
export class ClerkWebhookController {
  @Post()
  @HttpCode(HttpStatus.OK)
  async webhook() {
    //...
  }
}
