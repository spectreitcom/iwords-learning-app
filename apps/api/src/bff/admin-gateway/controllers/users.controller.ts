import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserApiService } from '../../../user-identity/appliaction/services/user-api.service';
import { GetUsersListQueryDto } from '../dtos/get-users-list-query.dto';
import { BlockUserDto } from '../dtos/block-user.dto';
import { UnblockUserDto } from '../dtos/unblock-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiTags('Admin Users')
@Controller('admin/users')
export class UsersController {
  constructor(private readonly userApiService: UserApiService) {}

  @ApiBearerAuth('admin-auth')
  @ApiOperation({ summary: 'Get users list' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              userId: { type: 'string', format: 'uuid' },
              email: { type: 'string', format: 'email' },
              name: { type: 'string', example: 'John Doe' },
              blocked: { type: 'boolean' },
            },
          },
        },
        total: { type: 'number', format: 'int32', example: 100 },
        currentPage: { type: 'number', format: 'int32', example: 1 },
      },
    },
  })
  @Get()
  async getUsersList(@Query() query: GetUsersListQueryDto) {
    return await this.userApiService.getUsersList(query.take, query.page);
  }

  @ApiBearerAuth('admin-auth')
  @ApiOperation({
    summary: 'Block user',
    description: 'Blocks the user by ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User blocked successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @Post('block')
  @HttpCode(HttpStatus.OK)
  async blockUser(@Body() payload: BlockUserDto) {
    return await this.userApiService.blockUser(payload.userId);
  }

  @ApiBearerAuth('admin-auth')
  @ApiOperation({
    summary: 'Unblock user',
    description: 'Unblocks the user by ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User unblocked successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @Post('unblock')
  @HttpCode(HttpStatus.OK)
  async unblockUser(@Body() payload: UnblockUserDto) {
    return await this.userApiService.unblockUser(payload.userId);
  }
}
