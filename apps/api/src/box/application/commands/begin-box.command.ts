import { ICommand } from '@nestjs/cqrs';

export class BeginBoxCommand implements ICommand {
  constructor(
    public readonly boxId: string,
    public readonly userId: string,
  ) {}
}
