import { ICommand } from '@nestjs/cqrs';

export class ValidateSentenceUsingAiCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly expressionContextId: string,
    public readonly userSentence: string,
  ) {}
}
