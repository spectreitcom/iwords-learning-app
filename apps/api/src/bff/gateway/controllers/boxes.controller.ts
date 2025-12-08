import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
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
import { BoxApiService } from '../../../box/application/services/box-api.service';
import { GetBoxesListQueryDto } from '../dtos/get-boxes-list-query.dto';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { DictionaryApiService } from '../../../dictionary/application/services/dictionary-api.service';
import { CurrentUserId } from '../auth/current-user-id.decorator';

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
    status: HttpStatus.OK,
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
              isFinished: { type: 'boolean' },
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
    const response = await this.boxApiService.getBoxesList(
      query.take,
      query.page,
    );

    const finishedBoxesData =
      await this.boxApiService.getInformationIfBoxIsFinishedByBoxIds(
        response.data.map((box) => box.boxId),
      );

    const data = response.data.map((box) => ({
      ...box,
      isFinished:
        finishedBoxesData.find((item) => item.boxId === box.boxId)
          ?.isFinished ?? false,
    }));

    return {
      ...response,
      data,
    };
  }

  @ApiBearerAuth('app-auth')
  @ApiOperation({ summary: 'Returns the box details' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the box details',
    schema: {
      type: 'object',
      properties: {
        boxId: { type: 'string', format: 'uuid' },
        title: { type: 'string' },
        isBoxStarted: { type: 'boolean' },
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              expressionContextId: { type: 'string', format: 'uuid' },
              expressionId: { type: 'string', format: 'uuid' },
              phrase: { type: 'string' },
              translation: { type: 'string' },
              definition: { type: 'string' },
              definitionTranslation: { type: 'string' },
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
    status: HttpStatus.NOT_FOUND,
    description: 'Box not found',
  })
  @Get(':boxId')
  async getBoxDetails(
    @Param('boxId', new ParseUUIDPipe()) boxId: string,
    @CurrentUserId() userId: string,
  ) {
    const box = await this.boxApiService.getBoxById(boxId);

    const items =
      await this.dictionaryApiService.getDictionaryReadModelsByExpressionContextIds(
        box.expressionContextIds,
      );

    const sentences =
      await this.dictionaryApiService.getSentencesByExpressionContextIds(
        items.map((i) => i.expressionContextId),
      );

    const isBoxStarted = await this.boxApiService.isBoxStarted(
      userId,
      box.boxId,
    );

    return {
      boxId: box.boxId,
      title: box.title,
      isBoxStarted,
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

  @ApiBearerAuth('app-auth')
  @ApiOperation({ summary: 'Marks the box as in learning' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Box marked as in learning',
  })
  @Post(':boxId/start')
  @HttpCode(HttpStatus.OK)
  async startBox(
    @Param('boxId', new ParseUUIDPipe()) boxId: string,
    @CurrentUserId() userId: string,
  ) {
    return await this.boxApiService.beginBox(userId, boxId);
  }

  @ApiBearerAuth('app-auth')
  @ApiOperation({ summary: 'Marks the box as finished' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Box marked as finished',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Box not found',
  })
  @Post(':boxId/finish')
  @HttpCode(HttpStatus.NO_CONTENT)
  async markBoxAsFinished(
    @Param('boxId', new ParseUUIDPipe()) boxId: string,
    @CurrentUserId() userId: string,
  ) {
    return await this.boxApiService.markBoxAsFinished(boxId, userId);
  }
}
