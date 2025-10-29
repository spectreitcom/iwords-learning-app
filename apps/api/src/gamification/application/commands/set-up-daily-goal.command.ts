import { ICommand } from '@nestjs/cqrs';

export class SetUpDailyGoalCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly goal: number,
  ) {}
}
