import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { GetUsersListQueryHandler } from './query-handlers/get-users-list.query-handler';
import { UserApiService } from './services/user-api.service';
import { BlockUserCommandHandler } from './command-handlers/block-user.command-handler';
import { UnblockUserCommandHandler } from './command-handlers/unblock-user.command-handler';
import { CreateUserCommandHandler } from './command-handlers/create-user.command-handler';
import { DeleteUserCommandHandler } from './command-handlers/delete-user.command-handler';
import { OutboxModule } from '../../common/outbox/outbox.module';

const EVENT_HANDLERS = [];

const COMMAND_HANDLERS = [
  BlockUserCommandHandler,
  UnblockUserCommandHandler,
  CreateUserCommandHandler,
  DeleteUserCommandHandler,
];

const QUERY_HANDLERS = [GetUsersListQueryHandler];

@Module({
  imports: [InfrastructureModule, PrismaModule, OutboxModule],
  providers: [
    ...EVENT_HANDLERS,
    ...COMMAND_HANDLERS,
    ...QUERY_HANDLERS,
    UserApiService,
  ],
  exports: [UserApiService],
})
export class UserIdentityModule {}
