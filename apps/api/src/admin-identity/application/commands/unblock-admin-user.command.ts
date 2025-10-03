import { ICommand } from '@nestjs/cqrs';

export class UnblockAdminUserCommand implements ICommand {
  constructor(
    public readonly adminUserId: string,
    public readonly userToUnblockId: string,
  ) {}
}
