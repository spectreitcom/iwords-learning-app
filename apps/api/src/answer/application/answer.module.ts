import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { DictionaryExpressionContextCreatedEventHandler } from './event-handlers/dictionary-expression-context-created.event-handler';
import { DictionarySentenceCreatedEventHandler } from './event-handlers/dictionary-sentence-created.event-handler';
import { DictionaryExpressionContextUpdatedEventHandler } from './event-handlers/dictionary-expression-context-updated.event-handler';
import { DictionaryExpressionContextDeletedEventHandler } from './event-handlers/dictionary-expression-context-deleted.event-handler';
import { DictionarySentenceDeletedEventHandler } from './event-handlers/dictionary-sentence-deleted.event-handler';
import { DictionarySentenceUpdatedEventHandler } from './event-handlers/dictionary-sentence-updated.event-handler';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { CheckAnswerForSimpleTranslationCommandHandler } from './command-handlers/check-answer-for-simple-translation.command-handler';
import { CheckAnswerForIrregularVerbCommandHandler } from './command-handlers/check-answer-for-irregular-verb.command-handler';
import { CheckAnswerForSentenceCommandHandler } from './command-handlers/check-answer-for-sentence.command-handler';
import { AnswerApiService } from './services/answer-api.service';

const EVENT_HANDLERS = [
  DictionaryExpressionContextCreatedEventHandler,
  DictionarySentenceCreatedEventHandler,
  DictionaryExpressionContextUpdatedEventHandler,
  DictionaryExpressionContextDeletedEventHandler,
  DictionarySentenceDeletedEventHandler,
  DictionarySentenceUpdatedEventHandler,
];

const COMMAND_HANDLERS = [
  CheckAnswerForSimpleTranslationCommandHandler,
  CheckAnswerForIrregularVerbCommandHandler,
  CheckAnswerForSentenceCommandHandler,
];

@Module({
  imports: [InfrastructureModule, PrismaModule],
  providers: [...EVENT_HANDLERS, ...COMMAND_HANDLERS, AnswerApiService],
  exports: [AnswerApiService],
})
export class AnswerModule {}
