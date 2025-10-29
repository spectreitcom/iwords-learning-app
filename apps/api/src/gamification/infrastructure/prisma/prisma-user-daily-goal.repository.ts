import { Injectable } from '@nestjs/common';
import { UserDailyGoalRepository } from '../../application/ports/user-daily-goal.repository';
import { UserDailyGoal } from 'src/gamification/domain/user-daily-goal';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { UserDailyGoalId } from '../../domain/value-objects/user-daily-goal-id';
import { UserId } from '../../domain/value-objects/user-id';
import { Goal } from '../../domain/value-objects/goal';

@Injectable()
export class PrismaUserDailyGoalRepository implements UserDailyGoalRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async save(userDailyGoal: UserDailyGoal): Promise<void> {
    const id = userDailyGoal.getUserDailyGoalId().value;
    const userId = userDailyGoal.getUserId().value;
    const goal = userDailyGoal.getGoal().value;

    await this.prismaService.userDailyGoal.upsert({
      where: { userId },
      create: { id, userId, goal },
      update: { goal },
    });
  }

  async findByUserId(userId: string): Promise<UserDailyGoal | null> {
    const record = await this.prismaService.userDailyGoal.findUnique({
      where: { userId },
    });

    if (!record) return null;

    return new UserDailyGoal(
      UserDailyGoalId.fromString(record.id),
      UserId.fromString(record.userId),
      Goal.create(record.goal),
    );
  }
}
