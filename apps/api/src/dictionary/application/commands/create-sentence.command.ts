import { ICommand } from '@nestjs/cqrs';

export class CreateSentenceCommand implements ICommand {
  constructor(
    public readonly content: string,
    public readonly translation: string,
    public readonly expressionContextId: string,
  ) {}
}
