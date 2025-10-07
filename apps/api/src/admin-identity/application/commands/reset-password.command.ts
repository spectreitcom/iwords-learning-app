import { ICommand } from '@nestjs/cqrs';

export class ResetPasswordCommand implements ICommand {
  constructor(
    public readonly newPassword: string,
    public readonly token: string,
  ) {}
}
