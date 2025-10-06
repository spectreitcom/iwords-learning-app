import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { AdminIdentityApiService } from '../../../admin-identity/application/services/admin-identity-api.service';
import { CurrentAdminUserId } from '../auth/current-admin-user-id.decorator';
import { Public } from '../auth/public.decorator';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { ChangePasswordForLoggedUserDto } from '../dtos/change-password-for-logged-user.dto';
import { GetAdminUsersListQueryDto } from '../dtos/get-admin-users-list-query.dto';
import { BlockAdminUserDto } from '../dtos/block-admin-user.dto';
import { UnblockAdminUserDto } from '../dtos/unblock-admin-user.dto';

@ApiTags('Admin Identity')
@Controller('admin')
export class AuthController {
  constructor(
    private readonly adminIdentityApiService: AdminIdentityApiService,
  ) {}

  @Public()
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
  @Post('auth/sign-in')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  signIn(@CurrentAdminUserId() userId: string) {
    return this.adminIdentityApiService.signIn(userId);
  }

  @Public()
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
  @Post('auth/refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() payload: RefreshTokenDto) {
    return await this.adminIdentityApiService.refreshToken(
      payload.refreshToken,
    );
  }

  @ApiBearerAuth('admin-auth')
  @ApiOperation({ summary: 'Sign out admin user' })
  @Post('auth/sign-out')
  @HttpCode(HttpStatus.OK)
  async signOut(@CurrentAdminUserId() userId: string) {
    return await this.adminIdentityApiService.signOut(userId);
  }

  @ApiBearerAuth('admin-auth')
  @ApiOperation({ summary: 'Change password for logged user' })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @Patch('auth/change-password')
  changePasswordForLoggedUser(
    @CurrentAdminUserId() userId: string,
    @Body() payload: ChangePasswordForLoggedUserDto,
  ) {
    return this.adminIdentityApiService.changeLoggedUserPassword(
      userId,
      payload.existingPassword,
      payload.newPassword,
    );
  }

  @ApiBearerAuth('admin-auth')
  @ApiOperation({ summary: 'Get admin users list' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of admin users',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              email: { type: 'string', format: 'email' },
              name: { type: 'string', example: 'John Doe' },
              blocked: { type: 'boolean', example: false },
            },
          },
        },
        currentPage: { type: 'number', format: 'int32' },
        total: { type: 'number', format: 'int32' },
      },
    },
  })
  @Get('admin-users')
  async getAdminUsersList(
    @CurrentAdminUserId() userId: string,
    @Body() payload: GetAdminUsersListQueryDto,
  ) {
    return await this.adminIdentityApiService.getUsersList(
      userId,
      payload.take,
      payload.page,
    );
  }

  @ApiBearerAuth('admin-auth')
  @ApiOperation({ summary: 'Block admin user' })
  @ApiResponse({
    status: 204,
    description: 'Admin user blocked successfully',
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'Admin user not found' })
  @Post('admin-users/block')
  @HttpCode(HttpStatus.NO_CONTENT)
  async blockAdminUser(
    @CurrentAdminUserId() userId: string,
    @Body() payload: BlockAdminUserDto,
  ) {
    return await this.adminIdentityApiService.blockAdminUser(
      userId,
      payload.adminUserId,
    );
  }

  @ApiBearerAuth('admin-auth')
  @ApiOperation({ summary: 'Unblock admin user' })
  @ApiResponse({
    status: 204,
    description: 'Admin user unblocked successfully',
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'Admin user not found' })
  @Post('admin-users/unblock')
  @HttpCode(HttpStatus.NO_CONTENT)
  async unblockAdminUser(
    @CurrentAdminUserId() userId: string,
    @Body() payload: UnblockAdminUserDto,
  ) {
    return await this.adminIdentityApiService.unblockAdminUser(
      userId,
      payload.adminUserId,
    );
  }
}
