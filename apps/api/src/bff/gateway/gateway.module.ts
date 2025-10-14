import { Module } from '@nestjs/common';
import { AnswerModule } from '../../answer/application/answer.module';
import { AnswerController } from './controllers/answer.controller';
import { BoxModule } from '../../box/application/box.module';
import { BoxesController } from './controllers/boxes.controller';

@Module({
  imports: [AnswerModule, BoxModule],
  controllers: [AnswerController, BoxesController],
  providers: [],
})
export class GatewayModule {}
