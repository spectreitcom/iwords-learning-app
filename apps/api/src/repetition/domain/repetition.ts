import { RepetitionId } from './value-objects/repetition-id';
import { UserId } from './value-objects/user-id';
import { ExpressionContextId } from './value-objects/expression-context-id';
import { NextRepetitionDate } from './value-objects/next-repetition-date';

export class Repetition {
  private readonly repetitionId: RepetitionId;
  private readonly userId: UserId;
  private readonly expressionContextId: ExpressionContextId;
  private nextRepetition: NextRepetitionDate;

  constructor(
    repetitionId: RepetitionId,
    userId: UserId,
    expressionContextId: ExpressionContextId,
    nextRepetition: NextRepetitionDate,
  ) {
    this.repetitionId = repetitionId;
    this.userId = userId;
    this.expressionContextId = expressionContextId;
    this.nextRepetition = nextRepetition;
  }

  static create(
    userId: string,
    expressionContextId: string,
    nextRepetition: Date,
  ) {
    const repetitionId = RepetitionId.create();
    return new Repetition(
      repetitionId,
      UserId.fromString(userId),
      ExpressionContextId.fromString(expressionContextId),
      NextRepetitionDate.create(nextRepetition),
    );
  }

  reschedule(nextRepetition: Date) {
    this.nextRepetition = NextRepetitionDate.create(nextRepetition);
  }

  getRepetitionId() {
    return this.repetitionId;
  }

  getUserId() {
    return this.userId;
  }

  getExpressionContextId() {
    return this.expressionContextId;
  }

  getNextRepetition() {
    return this.nextRepetition;
  }
}
