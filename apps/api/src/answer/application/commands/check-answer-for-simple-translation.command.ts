import { ICommand } from '@nestjs/cqrs';

export class CheckAnswerForSimpleTranslationCommand implements ICommand {
  constructor(
    public readonly answer: string,
    public readonly expressionContextId: string,
    public readonly userId: string,
  ) {}
}
