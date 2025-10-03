import { ICommand } from '@nestjs/cqrs';

export class BlockAdminUserCommand implements ICommand {
  constructor(
    public readonly adminUserId: string,
    public readonly userToBlockId: string,
  ) {}
}
