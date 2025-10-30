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
      },
    },
  })
  @Get('user-goal')
  async getUserDailyGoal(@CurrentUserId() userId: string) {
    const userDailyGoal =
      await this.gamificationApiService.getUserDailyGoal(userId);
    return {
      goal: userDailyGoal,
    };
  }
}
