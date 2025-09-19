import { AggregateRoot } from '@nestjs/cqrs';
import { SentenceId } from './value-objects/sentence-id';
import { ExpressionContextId } from './value-objects/expression-context-id';
import { SentenceCreatedEvent } from './events/sentence-created.event';
import { SentenceDeletedEvent } from './events/sentence-deleted.event';

export class Sentence extends AggregateRoot {
  private readonly sentenceId: SentenceId;
  private content: string;
  private translation: string;
  private readonly expressionContextId: ExpressionContextId;

  constructor(
    sentenceId: SentenceId,
    content: string,
    translation: string,
    expressionContextId: ExpressionContextId,
  ) {
    super();
    this.sentenceId = sentenceId;
    this.content = content;
    this.translation = translation;
    this.expressionContextId = expressionContextId;
  }

  static create(
    content: string,
    translation: string,
    expressionContextId: string,
  ) {
    const sentence = new Sentence(
      SentenceId.create(),
      content,
      translation,
      ExpressionContextId.fromString(expressionContextId),
    );

    sentence.apply(
      new SentenceCreatedEvent(
        sentence.getSentenceId().value,
        sentence.getContent(),
        sentence.getTranslation(),
        sentence.getExpressionContextId().value,
      ),
    );

    return sentence;
  }

  delete() {
    this.apply(new SentenceDeletedEvent(this.sentenceId.value));
  }

  getSentenceId(): SentenceId {
    return this.sentenceId;
  }

  getContent(): string {
    return this.content;
  }

  getTranslation(): string {
    return this.translation;
  }

  getExpressionContextId() {
    return this.expressionContextId;
  }
}
