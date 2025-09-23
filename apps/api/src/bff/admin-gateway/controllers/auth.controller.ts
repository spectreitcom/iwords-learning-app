import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { AdminIdentityApiService } from '../../../admin-identity/application/services/admin-identity-api.service';
import { CurrentAdminUserId } from '../auth/current-admin-user-id.decorator';
import { Public } from '../auth/public.decorator';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import {
  AdminIdentityNotFoundError,
  InvalidRefreshTokenError,
} from '../../../admin-identity/application/errors';

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
        refreshToken: { type: 'string' },
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
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  signIn(@CurrentAdminUserId() userId: string) {
    return this.adminIdentityApiService.signIn(userId);
  }

  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'Access token refreshed successfully',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
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
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() payload: RefreshTokenDto) {
    try {
      return await this.adminIdentityApiService.refreshToken(
        payload.refreshToken,
      );
    } catch (e) {
      if (e instanceof InvalidRefreshTokenError)
        throw new UnauthorizedException();
      if (e instanceof AdminIdentityNotFoundError)
        throw new UnauthorizedException();
      throw e;
    }
  }
}
