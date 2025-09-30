import { ICommand } from '@nestjs/cqrs';

export class DeleteBoxCommand implements ICommand {
  constructor(public readonly boxId: string) {}
}
