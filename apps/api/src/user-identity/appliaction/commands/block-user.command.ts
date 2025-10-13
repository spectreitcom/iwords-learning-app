import { ICommand } from '@nestjs/cqrs';

export class BlockUserCommand implements ICommand {
  constructor(public readonly userToBlockId: string) {}
}
