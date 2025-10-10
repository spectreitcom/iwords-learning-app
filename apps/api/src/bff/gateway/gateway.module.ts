import { Module } from '@nestjs/common';
import { AnswerModule } from '../../answer/application/answer.module';

@Module({
  imports: [AnswerModule],
})
export class GatewayModule {}
