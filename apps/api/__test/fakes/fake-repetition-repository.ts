import { RepetitionRepository } from '../../src/repetition/application/ports/repetition.repository';
import { Repetition } from '../../src/repetition/domain/repetition';
import { RepetitionId } from '../../src/repetition/domain/value-objects/repetition-id';
import { UserId } from '../../src/repetition/domain/value-objects/user-id';
import { ExpressionContextId } from '../../src/repetition/domain/value-objects/expression-context-id';
import { NextRepetitionDate } from '../../src/repetition/domain/value-objects/next-repetition-date';

export type RepetitionModel = {
  id: string;
  expressionContextId: string;
  userId: string;
  nextRepetition: Date;
};

export abstract class FakeRepetitionClass extends RepetitionRepository {
  abstract getLength(): number;
  abstract isAggregateSaved(): boolean;
}

export class FakeRepetitionRepository implements FakeRepetitionClass {
  private data = new Map<string, RepetitionModel>();
  private aggregateSaved = false;

  constructor(initData: RepetitionModel[] = []) {
    initData.forEach((d) => this.data.set(d.id, d));
  }

  async delete(userId: string, repetitionId: string): Promise<void> {
    const item = this.data.get(repetitionId);
    if (item) {
      this.data.delete(repetitionId);
    }
  }

  async deleteAllForUser(userId: string): Promise<void> {
    for (const [repetitionId, value] of this.data.entries()) {
      if (value.userId === userId) {
        this.data.delete(repetitionId);
      }
    }
  }

  async deleteOne(userId: string, expressionContextId: string): Promise<void> {
    for (const [repetitionId, value] of this.data.entries()) {
      if (
        value.userId === userId &&
        value.expressionContextId === expressionContextId
      ) {
        this.data.delete(repetitionId);
      }
    }
  }

  async findByUser(userId: string): Promise<Repetition[]> {
    const result: Repetition[] = [];

    for (const [_, value] of this.data.entries()) {
      if (value.userId === userId) {
        result.push(
          new Repetition(
            RepetitionId.fromString(value.id),
            UserId.fromString(value.userId),
            ExpressionContextId.fromString(value.expressionContextId),
            NextRepetitionDate.create(value.nextRepetition),
          ),
        );
      }
    }

    return result;
  }

  async save(repetition: Repetition): Promise<void> {
    this.aggregateSaved = true;
  }

  getLength(): number {
    return this.data.size;
  }

  isAggregateSaved(): boolean {
    return this.aggregateSaved;
  }
}
