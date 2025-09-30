import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
import { DictionaryApiService } from '../../../dictionary/application/services/dictionary-api.service';

@ApiTags('Admin Boxes')
@Controller('admin/boxes')
export class BoxController {
  constructor(
    private readonly boxApiService: BoxApiService,
    private readonly dictionaryApiService: DictionaryApiService,
  ) {}

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
    status: 204,
    description: 'Box updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Box not found' })
  @Put(':boxId')
  @HttpCode(HttpStatus.NO_CONTENT)
  updateBox(
    @Param('boxId', new ParseUUIDPipe()) boxId: string,
    @Body() payload: UpdateBoxDto,
  ) {
    return this.boxApiService.updateBox(boxId, payload.title);
  }

  @ApiBearerAuth('admin-auth')
  @ApiOperation({ summary: 'Delete the box by id' })
  @ApiResponse({
    status: 204,
    description: 'Box deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Box not found' })
  @Delete(':boxId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteBox(@Param('boxId', new ParseUUIDPipe()) boxId: string) {
    return this.boxApiService.deleteBox(boxId);
  }

  @ApiBearerAuth('admin-auth')
  @ApiOperation({ summary: 'Get box details' })
  @ApiResponse({
    status: 200,
    description: 'Returns the box details',
    schema: {
      type: 'object',
      properties: {
        boxId: { type: 'string', format: 'uuid' },
        title: { type: 'string' },
        boxItems: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              expressionContextId: { type: 'string', format: 'uuid' },
              phrase: { type: 'string' },
              translation: { type: 'string' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Box not found' })
  @Get(':boxId')
  @HttpCode(HttpStatus.OK)
  async getBoxDetails(@Param('boxId', new ParseUUIDPipe()) boxId: string) {
    const boxDetails = await this.boxApiService.getBoxById(boxId);
    const expressionContextReadModels =
      await this.dictionaryApiService.getDictionaryReadModelsByExpressionContextIds(
        boxDetails.expressionContextIds,
      );
    return {
      boxId: boxDetails.boxId,
      title: boxDetails.title,
      boxItems: expressionContextReadModels.map((context) => ({
        expressionContextId: context.expressionContextId,
        phrase: context.phrase,
        translation: context.translation,
      })),
    };
  }
}
