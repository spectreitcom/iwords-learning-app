import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { InboxService } from './inbox.service';
import { InboxPublisher } from './inbox.publisher';
import { INBOX_ROUTER, InboxRouterFn } from './inbox.router';
import { UserIdentityInboxRouter } from '../../user-identity/infrastructure/user-identity-inbox.router';
import { InfrastructureModule as UserIdentityInfrastructureModule } from '../../user-identity/infrastructure/infrastructure.module';
import { ClockModule } from '../clock/clock.module';

@Module({
  imports: [PrismaModule, UserIdentityInfrastructureModule, ClockModule],
  providers: [
    InboxService,
    InboxPublisher,
    {
      provide: INBOX_ROUTER,
      useFactory: (
        userIdentityInboxRouter: UserIdentityInboxRouter,
      ): InboxRouterFn => {
        return async (msg) => {
          if (msg.source === 'clerk')
            return userIdentityInboxRouter.handle(msg);
          throw new Error(`No router for source=${String(msg.source)}`);
        };
      },
      inject: [UserIdentityInboxRouter],
    },
  ],
  exports: [InboxService],
})
export class InboxModule {}
