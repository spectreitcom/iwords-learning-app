import {
  Controller,
  Get,
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
import { DictionaryApiService } from '../../../dictionary/application/services/dictionary-api.service';

@UseGuards(ClerkAuthGuard)
@ApiTags('App - Dictionary')
@Controller('dictionary')
export class DictionaryController {
  constructor(private readonly dictionaryApiService: DictionaryApiService) {}

  @ApiBearerAuth('app-auth')
  @ApiOperation({ summary: 'Get expression context by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      type: 'object',
      properties: {
        expressionContextId: { type: 'string', format: 'uuid' },
        expressionId: { type: 'string', format: 'uuid' },
        phrase: { type: 'string' },
        translation: { type: 'string' },
        type: { type: 'string' },
        forms: { type: 'array', items: { type: 'string' } },
        isIrregular: { type: 'boolean' },
        isCountable: { type: 'boolean' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Expression context or expression not found',
  })
  @Get('expression-contexts/:expressionContextId')
  async getExpressionContext(
    @Param('expressionContextId', new ParseUUIDPipe())
    expressionContextId: string,
  ) {
    const expressionContext =
      await this.dictionaryApiService.getExpressionContextById(
        expressionContextId,
      );

    const expression = await this.dictionaryApiService.getExpressionById(
      expressionContext.expressionId,
    );

    return {
      expressionContextId,
      expressionId: expression.expressionId,
      phrase: expression.phrase,
      translation: expressionContext.translation,
      type: expressionContext.type,
      forms: expressionContext.forms,
      isIrregular: expressionContext.isIrregular,
      isCountable: expressionContext.isCountable,
    };
  }
}
