import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { MemoryScanApiService } from '../../../memory-scan/application/memory-scan-api.service';
import { CreateMemoryScanResultDto } from '../dtos/create-memory-scan-result.dto';
import { CurrentUserId } from '../auth/current-user-id.decorator';
import { DictionaryApiService } from '../../../dictionary/application/services/dictionary-api.service';

@UseGuards(ClerkAuthGuard)
@ApiTags('Memory Scan')
@Controller('memory-scan')
export class MemoryScanController {
  constructor(
    private readonly memoryScanApiService: MemoryScanApiService,
    private readonly dictionaryApiService: DictionaryApiService,
  ) {}

  @ApiBearerAuth('app-auth')
  @ApiOperation({ summary: 'Create memory scan result' })
  @ApiCreatedResponse({
    description: 'Memory scan result created',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Memory scan result ID',
          format: 'uuid',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Validation errors',
  })
  @Post()
  async createMemoryScanResult(
    @Body() payload: CreateMemoryScanResultDto,
    @CurrentUserId() userId: string,
  ) {
    const id = await this.memoryScanApiService.createMemoryScanResult(
      userId,
      payload.rememberedItemsCount,
      payload.rememberingTime,
    );

    return { id };
  }

  @ApiBearerAuth('app-auth')
  @ApiOperation({ summary: 'Get memory scan view' })
  @ApiOkResponse({
    description: 'Memory scan view',
    schema: {
      type: 'object',
      properties: {
        scanResults: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              itemsCount: { type: 'number', format: 'int32' },
              rememberedItemsCount: { type: 'number', format: 'int32' },
              rememberingTime: { type: 'number', format: 'int32' },
              createdAt: { type: 'string', format: 'date-time' },
            },
          },
        },
        learnedItems: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              expression: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  phrase: { type: 'string' },
                },
              },
              expressionContext: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  translation: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  })
  @Get('view')
  async getMemoryScanView(@CurrentUserId() userId: string) {
    const [memoryScanLearnedItems, memoryScanResults] = await Promise.all([
      this.memoryScanApiService.getLearnedItemsForToday(userId),
      this.memoryScanApiService.getScanResults(userId),
    ]);

    const scanResults = memoryScanResults.map((item) => ({
      itemsCount: item.itemsCount,
      rememberedItemsCount: item.rememberedItemsCount,
      rememberingTime: item.rememberingTime,
      createdAt: item.createdAt,
    }));

    const expressionContextIds = memoryScanLearnedItems.map(
      (item) => item.expressionContextId,
    );

    const dictionaryItems =
      await this.dictionaryApiService.getDictionaryReadModelsByExpressionContextIds(
        expressionContextIds,
      );

    const learnedItems = dictionaryItems.map((item) => ({
      expression: {
        id: item.id,
        phrase: item.phrase,
      },
      expressionContext: {
        id: item.expressionContextId,
        translation: item.translation,
      },
    }));

    return {
      scanResults,
      learnedItems,
    } satisfies {
      scanResults: {
        itemsCount: number;
        rememberedItemsCount: number;
        rememberingTime: number;
        createdAt: Date;
      }[];
      learnedItems: {
        expression: {
          id: string;
          phrase: string;
        };
        expressionContext: {
          id: string;
          translation: string;
        };
      }[];
    };
  }
}
