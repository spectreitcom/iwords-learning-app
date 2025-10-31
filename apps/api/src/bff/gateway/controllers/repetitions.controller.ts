import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RepetitionApiService } from '../../../repetition/application/services/repetition-api.service';
import { CurrentUserId } from '../auth/current-user-id.decorator';

@UseGuards(ClerkAuthGuard)
@ApiTags('App - Repetitions')
@Controller('repetitions')
export class RepetitionsController {
  constructor(private readonly repetitionApiService: RepetitionApiService) {}

  @ApiBearerAuth('app-auth')
  @ApiOperation({ summary: "Removes all user's repetitions" })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'All repetitions removed successfully',
  })
  @Delete('remove-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAllRepetitions(@CurrentUserId() userId: string) {
    return await this.repetitionApiService.deleteAllUserRepetitions(userId);
  }

  @ApiBearerAuth('app-auth')
  @ApiOperation({ summary: 'Removes a repetition' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Repetition removed successfully',
  })
  @Delete(':repetitionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @CurrentUserId() userId: string,
    @Param('repetitionId', new ParseUUIDPipe()) repetitionId: string,
  ) {
    return await this.repetitionApiService.deleteOneUserRepetition(
      userId,
      repetitionId,
    );
  }
}
