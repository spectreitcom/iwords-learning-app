import { ICommand } from '@nestjs/cqrs';

export class ResendInvitationEmailCommand implements ICommand {
  constructor(public readonly adminUserId: string) {}
}
