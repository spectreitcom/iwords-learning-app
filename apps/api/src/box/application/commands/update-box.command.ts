import { ICommand } from '@nestjs/cqrs';

export class UpdateBoxCommand implements ICommand {
  constructor(
    public readonly boxId: string,
    public readonly title: string,
  ) {}
}
