import { ICommand } from '@nestjs/cqrs';

export class CreateMemoryScanResultsCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly rememberedItemsCount: number,
    public readonly rememberingTime: number,
  ) {}
}
