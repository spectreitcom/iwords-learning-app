import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BoxApiService } from '../../../box/application/services/box-api.service';
import { GetBoxesListQueryDto } from '../dtos/get-boxes-list-query.dto';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';

@UseGuards(ClerkAuthGuard)
@ApiTags('App Boxes')
@Controller('boxes')
export class BoxesController {
  constructor(private readonly boxApiService: BoxApiService) {}

  @ApiBearerAuth('app-auth')
  @ApiOperation({ summary: 'Get boxes list' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of boxes',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              boxId: { type: 'string', format: 'uuid' },
              title: { type: 'string' },
              expressionContextIds: {
                type: 'array',
                items: { type: 'string', format: 'uuid' },
              },
            },
          },
        },
        total: { type: 'number', format: 'int32' },
        currentPage: { type: 'number', format: 'int32' },
      },
    },
  })
  @Get()
  async getBoxesList(@Query() query: GetBoxesListQueryDto) {
    return await this.boxApiService.getBoxesList(query.take, query.page);
  }
}
