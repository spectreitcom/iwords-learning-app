import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../../dictionary/infrastructure/infrastructure.module';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { GetUserByIdQueryHandler } from './query-handlers/get-user-by-id.query-handler';
import { AdminUserService } from './services/admin-user-api.service';

const EVENT_HANDLERS = [];

const COMMAND_HANDLERS = [];

const QUERY_HANDLERS = [GetUserByIdQueryHandler];

@Module({
  imports: [InfrastructureModule, PrismaModule],
  providers: [
    ...EVENT_HANDLERS,
    ...COMMAND_HANDLERS,
    ...QUERY_HANDLERS,
    AdminUserService,
  ],
  exports: [AdminUserService],
})
export class AdminUserModule {}
