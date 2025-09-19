import { ICommand } from '@nestjs/cqrs';

export class DeleteSentenceCommand implements ICommand {
  constructor(public readonly sentenceId: string) {}
}
