import { Module } from '@nestjs/common';
import { AdminRequestedResetPasswordEventHandler } from './event-handlers/admin-requested-reset-password.event-handler';

const EVENT_HANDLERS = [AdminRequestedResetPasswordEventHandler];

@Module({
  providers: [...EVENT_HANDLERS],
})
export class EmailNotificationModule {}
