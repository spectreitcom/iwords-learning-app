import { Module } from '@nestjs/common';
import { DictionaryModule } from '../../dictionary/application/dictionary.module';
import { AdminIdentityModule } from '../../admin-identity/application/admin-identity.module';

@Module({
  imports: [DictionaryModule, AdminIdentityModule],
})
export class AdminGatewayModule {}
