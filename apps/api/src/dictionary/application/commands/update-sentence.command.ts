import { ICommand } from '@nestjs/cqrs';

export class UpdateSentenceCommand implements ICommand {
  constructor(
    public readonly sentenceId: string,
    public readonly translation: string,
    public readonly content: string,
  ) {}
}
