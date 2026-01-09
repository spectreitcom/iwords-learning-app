import { Module } from '@nestjs/common';
import { AnswerModule } from '../../answer/application/answer.module';
import { AnswerController } from './controllers/answer.controller';
import { BoxModule } from '../../box/application/box.module';
import { BoxesController } from './controllers/boxes.controller';
import { ClerkAuthGuard } from './auth/clerk-auth.guard';
import { UserIdentityModule } from '../../user-identity/appliaction/user-identity.module';
import { DictionaryModule } from '../../dictionary/application/dictionary.module';
import { UsersController } from './controllers/users.controller';
import { GamificationModule } from '../../gamification/application/gamification.module';
import { GamificationController } from './controllers/gamification.controller';
import { RepetitionsController } from './controllers/repetitions.controller';
import { RepetitionModule } from '../../repetition/application/repetition.module';
import { DictionaryController } from './controllers/dictionary.controller';
import { BoxRepetitionModule } from '../../box-repetition/application/box-repetition.module';

@Module({
  imports: [
    AnswerModule,
    BoxModule,
    UserIdentityModule,
    DictionaryModule,
    GamificationModule,
    RepetitionModule,
    BoxRepetitionModule,
  ],
  controllers: [
    AnswerController,
    BoxesController,
    UsersController,
    GamificationController,
    RepetitionsController,
    DictionaryController,
  ],
  providers: [ClerkAuthGuard],
})
export class GatewayModule {}
