import { AnswerCheckedEventHandler } from './answer-checked.event-handler';
import { DictionaryExpressionContextDeletedEventHandler } from './dictionary-expression-context-deleted.event-handler';
import { DictionaryExpressionDeletedEventHandler } from './dictionary-expression-deleted.event-handler';

export const eventHandlers = [
  AnswerCheckedEventHandler,
  DictionaryExpressionContextDeletedEventHandler,
  DictionaryExpressionDeletedEventHandler,
];
