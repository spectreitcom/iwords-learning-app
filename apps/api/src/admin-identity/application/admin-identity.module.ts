import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { GetUserByIdQueryHandler } from './query-handlers/get-user-by-id.query-handler';
import { AdminIdentityApiService } from './services/admin-identity-api.service';
import { CreateAdminUserCommandHandler } from './command-handlers/create-admin-user.command-handler';
import { LoginCommandHandler } from './command-handlers/login.command-handler';
import { ValidateUserQueryHandler } from './query-handlers/validate-user.query-handler';
import { RefreshTokenCommandHandler } from './command-handlers/refresh-token.command-handler';
import { SignOutCommandHandler } from './command-handlers/sign-out.command-handler';
import { ChangePasswordCommandHandler } from './command-handlers/change-password.command-handler';
import { BlockAdminUserCommandHandler } from './command-handlers/block-admin-user.command-handler';
import { UnblockAdminUserCommandHandler } from './command-handlers/unblock-admin-user.command-handler';
import { GetUsersListQueryHandler } from './query-handlers/get-users-list.query-handler';

const EVENT_HANDLERS = [];

const COMMAND_HANDLERS = [
  CreateAdminUserCommandHandler,
  LoginCommandHandler,
  RefreshTokenCommandHandler,
  SignOutCommandHandler,
  ChangePasswordCommandHandler,
  BlockAdminUserCommandHandler,
  UnblockAdminUserCommandHandler,
];

const QUERY_HANDLERS = [
  GetUserByIdQueryHandler,
  ValidateUserQueryHandler,
  GetUsersListQueryHandler,
];

@Module({
  imports: [InfrastructureModule, PrismaModule],
  providers: [
    ...EVENT_HANDLERS,
    ...COMMAND_HANDLERS,
    ...QUERY_HANDLERS,
    AdminIdentityApiService,
  ],
  exports: [AdminIdentityApiService],
})
export class AdminIdentityModule {}
