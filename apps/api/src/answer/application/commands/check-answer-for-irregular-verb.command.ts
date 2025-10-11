import { ICommand } from '@nestjs/cqrs';

export class CheckAnswerForIrregularVerbCommand implements ICommand {
  constructor(
    public readonly answer: [string, string, string],
    public readonly expressionContextId: string,
  ) {}
}
