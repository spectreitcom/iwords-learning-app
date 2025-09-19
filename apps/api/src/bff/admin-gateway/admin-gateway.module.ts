import { Module } from '@nestjs/common';
import { DictionaryModule } from '../../dictionary/application/dictionary.module';

@Module({
  imports: [DictionaryModule],
})
export class AdminGatewayModule {}
