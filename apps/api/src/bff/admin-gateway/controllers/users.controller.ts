import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserApiService } from '../../../user-identity/appliaction/services/user-api.service';
import { GetUsersListQueryDto } from '../dtos/get-users-list-query.dto';

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
}
