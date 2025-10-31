import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RepetitionApiService } from '../../../repetition/application/services/repetition-api.service';
import { CurrentUserId } from '../auth/current-user-id.decorator';
import { DictionaryApiService } from '../../../dictionary/application/services/dictionary-api.service';

@UseGuards(ClerkAuthGuard)
@ApiTags('App - Repetitions')
@Controller('repetitions')
export class RepetitionsController {
  constructor(
    private readonly repetitionApiService: RepetitionApiService,
    private readonly dictionaryApiService: DictionaryApiService,
  ) {}

  @ApiBearerAuth('app-auth')
  @ApiOperation({ summary: 'Get user repetitions' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the user repetitions',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          repetitionId: {
            type: 'string',
            format: 'uuid',
          },
          expressionContext: {
            type: 'object',
            properties: {
              expressionContextId: {
                type: 'string',
                format: 'uuid',
              },
              expressionId: {
                type: 'string',
                format: 'uuid',
              },
              phrase: {
                type: 'string',
              },
              translation: {
                type: 'string',
              },
              type: {
                type: 'string',
              },
              forms: {
                type: 'array',
                items: {},
              },
              isCountable: {
                type: 'boolean',
              },
              isIrregular: {
                type: 'boolean',
              },
              sentences: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    sentenceId: {
                      type: 'string',
                      format: 'uuid',
                    },
                    content: {
                      type: 'string',
                    },
                    translation: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  @Get()
  async getUserRepetitions(@CurrentUserId() userId: string) {
    const repetitionViews =
      await this.repetitionApiService.getUserRepetitions(userId);

    const expressionContextIds = repetitionViews.map(
      (item) => item.expressionContextId,
    );

    const expressionContexts =
      await this.dictionaryApiService.getDictionaryReadModelsByExpressionContextIds(
        expressionContextIds,
      );

    const sentences =
      await this.dictionaryApiService.getSentencesByExpressionContextIds(
        expressionContextIds,
      );

    return repetitionViews.map((repetitionView) => ({
      repetitionId: repetitionView.repetitionId,
      expressionContext: {
        ...expressionContexts.find(
          (item) =>
            item.expressionContextId === repetitionView.expressionContextId,
        ),
        sentences: sentences
          .filter(
            (sentence) =>
              sentence.expressionContextId ===
              repetitionView.expressionContextId,
          )
          .map((sentence) => ({
            sentenceId: sentence.sentenceId,
            content: sentence.content,
            translation: sentence.translation,
          })),
      },
    }));
  }

  @ApiBearerAuth('app-auth')
  @ApiOperation({ summary: "Removes all user's repetitions" })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'All repetitions removed successfully',
  })
  @Delete('remove-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAllRepetitions(@CurrentUserId() userId: string) {
    return await this.repetitionApiService.deleteAllUserRepetitions(userId);
  }

  @ApiBearerAuth('app-auth')
  @ApiOperation({ summary: 'Removes a repetition' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Repetition removed successfully',
  })
  @Delete(':repetitionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @CurrentUserId() userId: string,
    @Param('repetitionId', new ParseUUIDPipe()) repetitionId: string,
  ) {
    return await this.repetitionApiService.deleteOneUserRepetition(
      userId,
      repetitionId,
    );
  }
}
