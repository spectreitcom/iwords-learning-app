import { ICommand } from '@nestjs/cqrs';

export class CreateBoxCommand implements ICommand {
  constructor(public readonly title: string) {}
}
