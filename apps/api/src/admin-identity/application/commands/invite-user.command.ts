import { ICommand } from '@nestjs/cqrs';

export class InviteUserCommand implements ICommand {
  constructor(
    public readonly email: string,
    public readonly name: string,
  ) {}
}
