import { IEvent } from '@nestjs/cqrs';

export class ExpressionContextUpdatedEvent implements IEvent {
  constructor(
    public readonly expressionContextId: string,
    public readonly expressionId: string,
    public readonly translation: string,
    public readonly isCountable: boolean,
    public readonly type: string,
    public readonly forms: [string, string, string] | null,
    public readonly isIrregular: boolean,
    public readonly definition: string | null,
    public readonly definitionTranslation: string | null,
  ) {}
}
