import { Module } from '@nestjs/common';
import { AdminUserModule } from '../admin-user/application/admin-user.module';
import { CreateAdminUser } from './create-admin-user';

@Module({
  imports: [AdminUserModule],
  providers: [CreateAdminUser],
})
export class CliModule {}
