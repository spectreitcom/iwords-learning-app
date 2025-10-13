import { Module } from '@nestjs/common';
import { AnswerModule } from '../../answer/application/answer.module';
import { AnswerController } from './controllers/answer.controller';

@Module({
  imports: [AnswerModule],
  controllers: [AnswerController],
  providers: [],
})
export class GatewayModule {}
