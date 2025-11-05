import { Controller, Get, UseGuards, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { CurrentUserId } from '../auth/current-user-id.decorator';
import { UserApiService } from '../../../user-identity/appliaction/services/user-api.service';

@UseGuards(ClerkAuthGuard)
@ApiTags('App - User Identity')
@Controller('users')
export class UsersController {
  constructor(private readonly userApiService: UserApiService) {}

  @ApiBearerAuth('app-auth')
  @ApiOperation({ summary: 'Get current logged user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the current logged user',
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', format: 'uuid' },
        email: { type: 'string', format: 'email' },
        name: { type: 'string', example: 'John Doe' },
        blocked: { type: 'boolean' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @Get('me')
  async getMe(@CurrentUserId() currentUserId: string) {
    return await this.userApiService.getUserById(currentUserId);
  }
}
