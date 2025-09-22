import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { GetUserByIdQueryHandler } from './query-handlers/get-user-by-id.query-handler';
import { AdminUserApiService } from './services/admin-user-api.service';
import { CreateAdminUserCommandHandler } from './command-handlers/create-admin-user.command-handler';
import { LoginCommandHandler } from './command-handlers/login.command-handler';

const EVENT_HANDLERS = [];

const COMMAND_HANDLERS = [CreateAdminUserCommandHandler, LoginCommandHandler];

const QUERY_HANDLERS = [GetUserByIdQueryHandler];

@Module({
  imports: [InfrastructureModule, PrismaModule],
  providers: [
    ...EVENT_HANDLERS,
    ...COMMAND_HANDLERS,
    ...QUERY_HANDLERS,
    AdminUserApiService,
  ],
  exports: [AdminUserApiService],
})
export class AdminIdentityModule {}
