import { ExpressionId } from './value-objects/expression-id';
import { AggregateRoot } from '@nestjs/cqrs';
import { ExpressionCreatedEvent } from './events/expression-created.event';
import { ExpressionPhraseUpdatedEvent } from './events/expression-phrase-updated.event';
import { ExpressionDeletedEvent } from './events/expression-deleted.event';

export class Expression extends AggregateRoot {
  private readonly expressionId: ExpressionId;
  private phrase: string;

  constructor(expressionId: string, phrase: string) {
    super();
    this.expressionId = ExpressionId.fromString(expressionId);
    this.phrase = phrase;
  }

  static create(phrase: string): Expression {
    const expressionId = ExpressionId.create();
    const expression = new Expression(expressionId.value, phrase);
    expression.apply(
      new ExpressionCreatedEvent(expressionId.value, expression.phrase),
    );
    return expression;
  }

  updatePhrase(phrase: string) {
    const oldPhrase = this.phrase;
    this.phrase = phrase;
    this.apply(
      new ExpressionPhraseUpdatedEvent(
        this.expressionId.value,
        oldPhrase,
        this.phrase,
      ),
    );
  }

  delete() {
    this.apply(new ExpressionDeletedEvent(this.expressionId.value));
  }

  getExpressionId(): ExpressionId {
    return this.expressionId;
  }

  getPhrase(): string {
    return this.phrase;
  }
}
