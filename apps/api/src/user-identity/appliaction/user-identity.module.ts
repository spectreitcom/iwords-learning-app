import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { GetUsersListQueryHandler } from './query-handlers/get-users-list.query-handler';
import { UserApiService } from './services/user-api.service';
import { BlockUserCommandHandler } from './command-handlers/block-user.command-handler';

const EVENT_HANDLERS = [];

const COMMAND_HANDLERS = [BlockUserCommandHandler];

const QUERY_HANDLERS = [GetUsersListQueryHandler];

@Module({
  imports: [InfrastructureModule, PrismaModule],
  providers: [
    ...EVENT_HANDLERS,
    ...COMMAND_HANDLERS,
    ...QUERY_HANDLERS,
    UserApiService,
  ],
  exports: [UserApiService],
})
export class UserIdentityModule {}
