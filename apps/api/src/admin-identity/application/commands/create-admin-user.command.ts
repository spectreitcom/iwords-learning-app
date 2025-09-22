import { ICommand } from '@nestjs/cqrs';

export class CreateAdminUserCommand implements ICommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly name: string,
    public readonly isSuperuser = false,
  ) {}
}
