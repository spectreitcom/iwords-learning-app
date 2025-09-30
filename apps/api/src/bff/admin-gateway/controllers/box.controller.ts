import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BoxApiService } from '../../../box/application/services/box-api.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateBoxDto } from '../dtos/create-box.dto';
import { GetBoxesListQueryDto } from '../dtos/get-boxes-list-query.dto';
import { UpdateBoxDto } from '../dtos/update-box.dto';
import { BoxNotFoundError } from '../../../box/application/errors';

@ApiTags('Admin Boxes')
@Controller('admin/boxes')
export class BoxController {
  constructor(private readonly boxApiService: BoxApiService) {}

  @ApiBearerAuth('admin-auth')
  @ApiOperation({ summary: 'Creates the new box' })
  @ApiResponse({
    status: 201,
    description: 'Box created successfully',
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createBox(@Body() payload: CreateBoxDto) {
    return this.boxApiService.createBox(payload.title);
  }

  @ApiBearerAuth('admin-auth')
  @ApiOperation({ summary: 'Gets the list of boxes' })
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
  @HttpCode(HttpStatus.OK)
  getBoxesList(@Query() query: GetBoxesListQueryDto) {
    return this.boxApiService.getBoxesList(query.take, query.page);
  }

  @ApiBearerAuth('admin-auth')
  @ApiOperation({ summary: 'Update the box by id' })
  @ApiResponse({
    status: 200,
    description: 'Box updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Box not found' })
  @Put(':boxId')
  @HttpCode(HttpStatus.OK)
  updateBox(
    @Param('boxId', new ParseUUIDPipe()) boxId: string,
    @Body() payload: UpdateBoxDto,
  ) {
    try {
      return this.boxApiService.updateBox(boxId, payload.title);
    } catch (e) {
      if (e instanceof BoxNotFoundError) {
        throw new NotFoundException(e.message);
      }
      throw e;
    }
  }
}
