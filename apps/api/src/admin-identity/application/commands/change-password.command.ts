import { ICommand } from '@nestjs/cqrs';

export class ChangePasswordCommand implements ICommand {
  constructor(
    public readonly existingPassword: string,
    public readonly newPassword: string,
    public readonly adminUserId: string,
  ) {}
}
