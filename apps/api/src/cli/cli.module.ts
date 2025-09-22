import { Module } from '@nestjs/common';
import { AdminIdentityModule } from '../admin-identity/application/admin-identity.module';
import { CreateAdminUser } from './create-admin-user';

@Module({
  imports: [AdminIdentityModule],
  providers: [CreateAdminUser],
})
export class CliModule {}
