import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUserId } from '../auth/current-user-id.decorator';
import { GamificationApiService } from '../../../gamification/application/services/gamification-api.service';
import { SetUpDailyGoalDto } from '../dtos/set-up-daily-goal.dto';

@UseGuards(ClerkAuthGuard)
@ApiTags('App - Gamification')
@Controller('gamification')
export class GamificationController {
  constructor(
    private readonly gamificationApiService: GamificationApiService,
  ) {}

  @ApiBearerAuth('app-auth')
  @ApiOperation({ summary: 'Set up daily goal' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Daily goal set up successfully',
  })
  @Post('goals')
  @HttpCode(HttpStatus.NO_CONTENT)
  async setUpDailyGoal(
    @CurrentUserId() userId: string,
    @Body() payload: SetUpDailyGoalDto,
  ) {
    return await this.gamificationApiService.setUpDailyGoal(
      userId,
      payload.goal,
    );
  }

  @ApiBearerAuth('app-auth')
  @ApiOperation({ summary: 'Get user daily goal' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the user daily goal',
    schema: {
      type: 'object',
      properties: {
        goal: { type: 'number' },
        todayPoints: { type: 'number' },
      },
    },
  })
  @Get('user-goal')
  async getUserDailyGoal(@CurrentUserId() userId: string) {
    const userDailyGoal =
      await this.gamificationApiService.getUserDailyGoal(userId);

    const todayPoints =
      await this.gamificationApiService.getUserTodayPoints(userId);

    return {
      goal: userDailyGoal,
      todayPoints,
    };
  }

  @ApiBearerAuth('app-auth')
  @Get('last-daily-goals-progress')
  @ApiOperation({
    summary: 'Get last 7 days of daily goals progress',
    description:
      "Returns the user's daily goal progress for the last 7 days as an array sorted by date.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of daily progress for the last 7 days',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          date: {
            type: 'string',
            description: 'Date in ISO format (YYYY-MM-DD)',
            example: '2025-11-06',
          },
          progress: {
            type: 'number',
            description: 'Accumulated points (or goal progress) for the day',
            example: 20,
          },
        },
      },
      example: [
        { date: '2025-11-01', progress: 20 },
        { date: '2025-11-02', progress: 20 },
        { date: '2025-11-03', progress: 20 },
        { date: '2025-11-04', progress: 20 },
        { date: '2025-11-05', progress: 20 },
        { date: '2025-11-06', progress: 20 },
        { date: '2025-11-07', progress: 35 },
      ],
    },
  })
  async getLastDailyGoalsProgress(@CurrentUserId() userId: string) {
    return await this.gamificationApiService.getLastXDaysGoalsProgress(
      userId,
      7,
    );
  }
}
