import { Module } from '@nestjs/common';
import { AnswerModule } from '../../answer/application/answer.module';
import { AnswerController } from './controllers/answer.controller';
import { BoxModule } from '../../box/application/box.module';
import { BoxesController } from './controllers/boxes.controller';
import { ClerkAuthGuard } from './auth/clerk-auth.guard';
import { UserIdentityModule } from '../../user-identity/appliaction/user-identity.module';

@Module({
  imports: [AnswerModule, BoxModule, UserIdentityModule],
  controllers: [AnswerController, BoxesController],
  providers: [ClerkAuthGuard],
})
export class GatewayModule {}
