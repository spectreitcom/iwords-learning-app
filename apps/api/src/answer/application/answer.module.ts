import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { DictionaryExpressionContextCreatedEventHandler } from './event-handlers/dictionary-expression-context-created.event-handler';
import { DictionarySentenceCreatedEventHandler } from './event-handlers/dictionary-sentence-created.event-handler';
import { DictionaryExpressionContextUpdatedEventHandler } from './event-handlers/dictionary-expression-context-updated.event-handler';

const EVENT_HANDLERS = [
  DictionaryExpressionContextCreatedEventHandler,
  DictionarySentenceCreatedEventHandler,
  DictionaryExpressionContextUpdatedEventHandler,
];

@Module({
  imports: [PrismaModule],
  providers: [...EVENT_HANDLERS],
})
export class AnswerModule {}
