import { Module } from '@nestjs/common';
import { DictionaryModule } from '../../dictionary/application/dictionary.module';
import { AdminUserModule } from '../../admin-user/application/admin-user.module';

@Module({
  imports: [DictionaryModule, AdminUserModule],
})
export class AdminGatewayModule {}
