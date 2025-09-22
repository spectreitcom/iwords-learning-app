import { Controller, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { AdminIdentityApiService } from '../../../admin-identity/application/services/admin-identity-api.service';
import { CurrentAdminUserId } from '../auth/current-admin-user-id.decorator';
import { Public } from '../auth/public.decorator';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';

@ApiTags('Admin Auth')
@Public()
@Controller('admin/auth')
export class AuthController {
  constructor(
    private readonly adminIdentityApiService: AdminIdentityApiService,
  ) {}

  @ApiOperation({ summary: 'Sign in admin user' })
  @ApiResponse({
    status: 200,
    description: 'User signed in successfully',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string', example: 'John Doe' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Wrong email or password' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string' },
      },
    },
  })
  @Post('sign-in')
  @UseGuards(LocalAuthGuard)
  signIn(@CurrentAdminUserId() userId: string) {
    return this.adminIdentityApiService.signIn(userId);
  }
}
