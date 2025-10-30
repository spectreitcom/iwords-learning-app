import { ICommand } from '@nestjs/cqrs';

export class CheckAnswerForSentenceCommand implements ICommand {
  constructor(
    public readonly answer: string,
    public readonly sentenceId: string,
    public readonly userId: string,
  ) {}
}
