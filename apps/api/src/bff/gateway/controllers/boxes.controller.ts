import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BoxApiService } from '../../../box/application/services/box-api.service';
import { GetBoxesListQueryDto } from '../dtos/get-boxes-list-query.dto';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { DictionaryApiService } from '../../../dictionary/application/services/dictionary-api.service';

@UseGuards(ClerkAuthGuard)
@ApiTags('App Boxes')
@Controller('boxes')
export class BoxesController {
  constructor(
    private readonly boxApiService: BoxApiService,
    private readonly dictionaryApiService: DictionaryApiService,
  ) {}

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

  @ApiBearerAuth('app-auth')
  @ApiOperation({ summary: 'Returns the box details' })
  @ApiResponse({
    status: 200,
    description: 'Returns the box details',
    schema: {
      type: 'object',
      properties: {
        boxId: { type: 'string', format: 'uuid' },
        title: { type: 'string' },
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              expressionContextId: { type: 'string', format: 'uuid' },
              expressionId: { type: 'string', format: 'uuid' },
              phrase: { type: 'string' },
              translation: { type: 'string' },
              type: { type: 'string' },
              forms: {
                type: 'array',
                items: { type: 'string' },
                nullable: true,
              },
              isCountable: { type: 'boolean' },
              isIrregular: { type: 'boolean' },
              sentences: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    sentenceId: { type: 'string', format: 'uuid' },
                    content: { type: 'string' },
                    translation: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Box not found',
  })
  @Get(':boxId')
  async getBoxDetails(@Param('boxId', new ParseUUIDPipe()) boxId: string) {
    const box = await this.boxApiService.getBoxById(boxId);

    const items =
      await this.dictionaryApiService.getDictionaryReadModelsByExpressionContextIds(
        box.expressionContextIds,
      );

    const sentences =
      await this.dictionaryApiService.getSentencesByExpressionContextIds(
        items.map((i) => i.expressionContextId),
      );

    return {
      boxId: box.boxId,
      title: box.title,
      items: items.map((item) => ({
        ...item,
        sentences: sentences
          .filter(
            (sentence) =>
              sentence.expressionContextId === item.expressionContextId,
          )
          .map((sentence) => ({
            sentenceId: sentence.sentenceId,
            content: sentence.content,
            translation: sentence.translation,
          })),
      })),
    };
  }
}
