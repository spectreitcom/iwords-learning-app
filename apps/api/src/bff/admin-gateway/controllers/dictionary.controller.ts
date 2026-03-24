import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateExpressionDto } from '../dtos/create-expression.dto';
import { DictionaryApiService } from '../../../dictionary/application/services/dictionary-api.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateExpressionDto } from '../dtos/update-expression.dto';
import { CreateVerbExpressionContextDto } from '../dtos/create-verb-expression-context.dto';
import { CreatePhrasalVerbExpressionContextDto } from '../dtos/create-phrasal-verb-expression-context.dto';
import { CreateNounExpressionContextDto } from '../dtos/create-noun-expression-context.dto';
import { CreateAdjectiveExpressionContextDto } from '../dtos/create-adjective-expression-context.dto';
import { CreateAdverbExpressionContextDto } from '../dtos/create-adverb-expression-context.dto';
import { CreateIrregularVerbExpressionContextDto } from '../dtos/create-irregular-verb-expression-context.dto';
import { CreateSentenceDto } from '../dtos/create-sentence.dto';
import { UpdateSentenceDto } from '../dtos/update-sentence.dto';
import { UpdateVerbExpressionContextDto } from '../dtos/update-verb-expression-context.dto';
import { UpdateAdjectiveExpressionContextDto } from '../dtos/update-adjective-expression-context.dto';
import { UpdateNounExpressionContextDto } from '../dtos/update-noun-expression-context.dto';
import { UpdateAdverbExpressionContextDto } from '../dtos/update-adverb-expression-context.dto';
import { UpdatePhrasalVerbExpressionContextDto } from '../dtos/update-phrasal-verb-expression-context.dto';
import { UpdateIrregularVerbExpressionContextDto } from '../dtos/update-irregular-verb-expression-context.dto';
import { SearchDictionaryQueryDto } from '../../shared/dtos/search-dictionary-query.dto';
import { GetExpressionsListQueryDto } from '../dtos/get-expressions-list-query.dto';
import { GetExpressionContextsListQueryDto } from '../dtos/get-expression-contexts-list-query.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateSimpleExpressionContextDto } from '../dtos/create-simple-expression-context.dto';
import { UpdateSimpleExpressionContextDto } from '../dtos/update-simple-expression-context.dto';
import { UpdateExpressionContextDefinitionDto } from '../dtos/update-expression-context-definition.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('Admin Dictionary')
@Controller('admin/dictionary')
export class DictionaryController {
  constructor(private readonly dictionaryApiService: DictionaryApiService) {}

  @ApiBearerAuth('admin-auth')
  @ApiOperation({ summary: 'Search in dictionary' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns a list of matching expressions',
  })
  @Get('search')
  @HttpCode(HttpStatus.OK)
  async searchDictionary(@Query() query: SearchDictionaryQueryDto) {
    return await this.dictionaryApiService.searchDictionaryReadModel(
      query.searchText,
      query.take,
      query.page,
    );
  }

  @ApiBearerAuth('admin-auth')
  @ApiOperation({ summary: 'Get expression number' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the number of expressions',
    schema: {
      type: 'object',
      properties: {
        expressionsNumber: { type: 'number' },
      },
    },
  })
  @Get('expressions/count')
  async getExpressionsNumber() {
    const expressionsNumber =
      await this.dictionaryApiService.getExpressionsNumber();
    return {
      expressionsNumber,
    };
  }

  @ApiBearerAuth('admin-auth')
  @ApiOperation({ summary: 'Get expression by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the expression by id',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Expression not found',
  })
  @Get('expressions/:expressionId')
  @HttpCode(HttpStatus.OK)
  async getExpression(
    @Param('expressionId', new ParseUUIDPipe()) expressionId: string,
  ) {
    return await this.dictionaryApiService.getExpressionById(expressionId);
  }

  @ApiBearerAuth('admin-auth')
  @ApiOperation({ summary: 'Get expressions list' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns a list of expressions',
  })
  @Get('expressions')
  @HttpCode(HttpStatus.OK)
  async getExpressionsList(@Query() query: GetExpressionsListQueryDto) {
    return await this.dictionaryApiService.getExpressionsList(
      query.searchText,
      query.take,
      query.page,
    );
  }

  @ApiBearerAuth('admin-auth')
  @ApiOperation({ summary: 'Create expression' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Returns either the new expressionId or the existing one',
    schema: {
      type: 'object',
      properties: {
        expressionId: { oneOf: [{ type: 'null' }, { type: 'string' }] },
        existingExpressionId: {
          oneOf: [{ type: 'null' }, { type: 'string' }],
        },
      },
    },
  })
  @Post('expressions')
  @HttpCode(HttpStatus.CREATED)
  async createExpression(@Body() payload: CreateExpressionDto) {
    return await this.dictionaryApiService.createExpression(payload.phrase);
  }

  @ApiBearerAuth('admin-auth')
  @ApiOperation({ summary: 'Update expression' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Expression updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Expression not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Expression phrase already taken',
  })
  @Put('expressions/:expressionId')
  @HttpCode(HttpStatus.OK)
  async updateExpression(
    @Body() payload: UpdateExpressionDto,
    @Param('expressionId', new ParseUUIDPipe()) expressionId: string,
  ) {
    return await this.dictionaryApiService.updateExpression(
      expressionId,
      payload.phrase,
    );
  }

  @ApiBearerAuth('admin-auth')
  @ApiOperation({ summary: 'Delete expression' })
  @Delete('expressions/:expressionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('admin-auth')
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Expression deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Expression not found',
  })
  async deleteExpression(
    @Param('expressionId', new ParseUUIDPipe()) expressionId: string,
  ) {
    return await this.dictionaryApiService.deleteExpression(expressionId);
  }

  @ApiBearerAuth('admin-auth')
  @ApiOperation({ summary: 'Expression context by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the expression context by id',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Expression context not found',
  })
  @Get('expression-contexts/:expressionContextId')
  async getExpressionContext(
    @Param('expressionContextId', new ParseUUIDPipe())
    expressionContextId: string,
  ) {
    return await this.dictionaryApiService.getExpressionContextById(
      expressionContextId,
    );
  }

  @ApiBearerAuth('admin-auth')
  @ApiOperation({ summary: 'Expression contexts list' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns a list of expression contexts',
  })
  @Get('expression-contexts')
  @HttpCode(HttpStatus.OK)
  async getExpressionContextsList(
    @Query() query: GetExpressionContextsListQueryDto,
  ) {
    return await this.dictionaryApiService.getExpressionContextList(
      query.expressionId,
      query.take,
      query.page,
    );
  }

  @ApiBearerAuth('admin-auth')
  @ApiOperation({ summary: 'Create verb expression context' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Expression context created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Expression not found',
  })
  @Post('expression-contexts/verb')
  @HttpCode(HttpStatus.CREATED)
  async createVerbExpressionContext(
    @Body() payload: CreateVerbExpressionContextDto,
  ) {
    return await this.dictionaryApiService.createVerbExpressionContext(
      payload.expressionId,
      payload.translation,
    );
  }

  @ApiBearerAuth('admin-auth')
  @ApiOperation({ summary: 'Create phrasal verb expression context' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Expression context created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Expression not found',
  })
  @Post('expression-contexts/phrasal-verb')
  @HttpCode(HttpStatus.CREATED)
  async createPhrasalVerbExpressionContext(
    @Body() payload: CreatePhrasalVerbExpressionContextDto,
  ) {
    return await this.dictionaryApiService.createPhrasalVerbExpressionContext(
      payload.expressionId,
      payload.translation,
    );
  }

  @ApiBearerAuth('admin-auth')
  @ApiOperation({ summary: 'Create noun expression context' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Expression context created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Expression not found',
  })
  @Post('expression-contexts/noun')
  @HttpCode(HttpStatus.CREATED)
  async createNounExpressionContext(
    @Body() payload: CreateNounExpressionContextDto,
  ) {
    return await this.dictionaryApiService.createNounExpressionContext(
      payload.expressionId,
      payload.translation,
      payload.isCountable,
    );
  }

  @ApiBearerAuth('admin-auth')
  @ApiOperation({ summary: 'Create adjective expression context' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Expression context created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Expression not found',
  })
  @Post('expression-contexts/adjective')
  @HttpCode(HttpStatus.CREATED)
  async createAdjectiveExpressionContext(
    @Body() payload: CreateAdjectiveExpressionContextDto,
  ) {
    return await this.dictionaryApiService.createAdjectiveExpressionContext(
      payload.expressionId,
      payload.translation,
    );
  }

  @ApiBearerAuth('admin-auth')
  @ApiOperation({ summary: 'Create adverb expression context' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Expression context created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Expression not found',
  })
  @Post('expression-contexts/adverb')
  @HttpCode(HttpStatus.CREATED)
  async createAdverbExpressionContext(
    @Body() payload: CreateAdverbExpressionContextDto,
  ) {
    return await this.dictionaryApiService.createAdverbExpressionContext(
      payload.expressionId,
      payload.translation,
    );
  }

  @ApiBearerAuth('admin-auth')
  @ApiOperation({ summary: 'Create simple expression context' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Expression context created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Expression not found',
  })
  @Post('expression-contexts/simple')
  @HttpCode(HttpStatus.CREATED)
  async createSimpleExpressionContext(
    @Body() payload: CreateSimpleExpressionContextDto,
  ) {
    return await this.dictionaryApiService.createSimpleExpressionContext(
      payload.expressionId,
      payload.translation,
    );
  }

  @ApiBearerAuth('admin-auth')
  @ApiOperation({ summary: 'Create irregular verb expression context' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Expression context created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Expression not found',
  })
  @Post('expression-contexts/irregular-verb')
  @HttpCode(HttpStatus.CREATED)
  async createIrregularVerbExpressionContext(
    @Body() payload: CreateIrregularVerbExpressionContextDto,
  ) {
    return await this.dictionaryApiService.createIrregularVerbExpressionContext(
      payload.expressionId,
      payload.translation,
      payload.forms,
    );
  }

  @ApiBearerAuth('admin-auth')
  @ApiOperation({ summary: 'Update expression context definition' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Expression context definition updated',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Expression context not found',
  })
  @Patch('expression-contexts/:expressionContextId/definition')
  async updateExpressionContextDefinition(
    @Body() payload: UpdateExpressionContextDefinitionDto,
    @Param('expressionContextId', new ParseUUIDPipe())
    expressionContextId: string,
  ) {
    return await this.dictionaryApiService.updateExpressionContextDefinition(
      expressionContextId,
      payload.definition,
      payload.definitionTranslation,
    );
  }

  @ApiBearerAuth('admin-auth')
  @ApiOperation({ summary: 'Update verb expression context' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Expression context updated',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Expression context not found',
  })
  @Put('expression-contexts/:expressionContextId/verb')
  @HttpCode(HttpStatus.OK)
  async updateVerbExpressionContext(
    @Body() payload: UpdateVerbExpressionContextDto,
    @Param('expressionContextId', new ParseUUIDPipe())
    expressionContextId: string,
  ) {
    return await this.dictionaryApiService.updateVerbExpressionContext(
      expressionContextId,
      payload.translation,
    );
  }

  @ApiBearerAuth('admin-auth')
  @ApiOperation({ summary: 'Update adjective expression context' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Expression context updated',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Expression context not found',
  })
  @Put('expression-contexts/:expressionContextId/adjective')
  @HttpCode(HttpStatus.OK)
  async updateAdjectiveExpressionContext(
    @Body() payload: UpdateAdjectiveExpressionContextDto,
    @Param('expressionContextId', new ParseUUIDPipe())
    expressionContextId: string,
  ) {
    return await this.dictionaryApiService.updateAdjectiveExpressionContext(
      expressionContextId,
      payload.translation,
    );
  }

  @ApiBearerAuth('admin-auth')
  @ApiOperation({ summary: 'Update noun expression context' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Expression context updated',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Expression context not found',
  })
  @Put('expression-contexts/:expressionContextId/noun')
  @HttpCode(HttpStatus.OK)
  async updateNounExpressionContext(
    @Body() payload: UpdateNounExpressionContextDto,
    @Param('expressionContextId', new ParseUUIDPipe())
    expressionContextId: string,
  ) {
    return await this.dictionaryApiService.updateNounExpressionContext(
      expressionContextId,
      payload.translation,
      payload.isCountable,
    );
  }

  @ApiBearerAuth('admin-auth')
  @ApiOperation({ summary: 'Update adverb expression context' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Expression context updated',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Expression context not found',
  })
  @Put('expression-contexts/:expressionContextId/adverb')
  @HttpCode(HttpStatus.OK)
  async updateAdverbExpressionContext(
    @Body() payload: UpdateAdverbExpressionContextDto,
    @Param('expressionContextId', new ParseUUIDPipe())
    expressionContextId: string,
  ) {
    return await this.dictionaryApiService.updateAdverbExpressionContext(
      expressionContextId,
      payload.translation,
    );
  }

  @ApiBearerAuth('admin-auth')
  @ApiOperation({ summary: 'Update simple expression context' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Expression context updated',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Expression context not found',
  })
  @Put('expression-contexts/:expressionContextId/simple')
  @HttpCode(HttpStatus.OK)
  async updateSimpleExpressionContext(
    @Body() payload: UpdateSimpleExpressionContextDto,
    @Param('expressionContextId', new ParseUUIDPipe())
    expressionContextId: string,
  ) {
    return await this.dictionaryApiService.updateSimpleExpressionContext(
      expressionContextId,
      payload.translation,
    );
  }

  @ApiBearerAuth('admin-auth')
  @ApiOperation({ summary: 'Update phrasal verb expression context' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Expression context updated',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Expression context not found',
  })
  @Put('expression-contexts/:expressionContextId/phrasal-verb')
  @HttpCode(HttpStatus.OK)
  async updatePhrasalVerbExpressionContext(
    @Body() payload: UpdatePhrasalVerbExpressionContextDto,
    @Param('expressionContextId', new ParseUUIDPipe())
    expressionContextId: string,
  ) {
    return await this.dictionaryApiService.updatePhrasalVerbExpressionContext(
      expressionContextId,
      payload.translation,
    );
  }

  @ApiBearerAuth('admin-auth')
  @ApiOperation({ summary: 'Update irregular verb expression context' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Expression context updated',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Expression context not found',
  })
  @Put('expression-contexts/:expressionContextId/irregular-verb')
  @HttpCode(HttpStatus.OK)
  async updateIrregularVerbExpressionContext(
    @Body() payload: UpdateIrregularVerbExpressionContextDto,
    @Param('expressionContextId', new ParseUUIDPipe())
    expressionContextId: string,
  ) {
    return await this.dictionaryApiService.updateIrregularVerbExpressionContext(
      expressionContextId,
      payload.translation,
      payload.forms,
    );
  }

  @Delete('expression-contexts/:expressionContextId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('admin-auth')
  @ApiOperation({ summary: 'Delete expression context' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Expression context deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Expression context not found',
  })
  async deleteExpressionContext(
    @Param('expressionContextId', new ParseUUIDPipe())
    expressionContextId: string,
  ) {
    return await this.dictionaryApiService.deleteExpressionContext(
      expressionContextId,
    );
  }

  @ApiBearerAuth('admin-auth')
  @ApiOperation({ summary: 'Get sentence by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the sentence by id',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Sentence not found',
  })
  @Get('sentences/:sentenceId')
  @HttpCode(HttpStatus.OK)
  async getSentence(
    @Param('sentenceId', new ParseUUIDPipe()) sentenceId: string,
  ) {
    return await this.dictionaryApiService.getSentenceById(sentenceId);
  }

  @ApiBearerAuth('admin-auth')
  @ApiOperation({ summary: 'Add sentence to the context' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Sentence added to the context successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Expression context not found',
  })
  @Post('sentences')
  @HttpCode(HttpStatus.CREATED)
  async addSentence(@Body() payload: CreateSentenceDto) {
    return await this.dictionaryApiService.createSentence(
      payload.content,
      payload.translation,
      payload.expressionContextId,
    );
  }

  @ApiBearerAuth('admin-auth')
  @ApiOperation({ summary: 'Delete sentence from the context' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Sentence deleted from the context successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Sentence not found',
  })
  @Delete('sentences/:sentenceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSentence(
    @Param('sentenceId', new ParseUUIDPipe()) sentenceId: string,
  ) {
    return await this.dictionaryApiService.deleteSentence(sentenceId);
  }

  @ApiBearerAuth('admin-auth')
  @ApiOperation({ summary: 'Update sentence' })
  @Put('sentences/:sentenceId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update sentence' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sentence updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Sentence not found',
  })
  async updateSentence(
    @Body() payload: UpdateSentenceDto,
    @Param('sentenceId', new ParseUUIDPipe()) sentenceId: string,
  ) {
    return await this.dictionaryApiService.updateSentence(
      sentenceId,
      payload.translation,
      payload.content,
    );
  }

  @ApiBearerAuth('admin-auth')
  @ApiOperation({ summary: 'Generate definition of expression context' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Definition generated successfully',
    schema: {
      type: 'object',
      properties: {
        definition: { type: 'string' },
        translation: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Expression context or expression not found',
  })
  @Get('ai/expression-context/:expressionContextId/generate-definition')
  async generateDefinitionOfExpressionContext(
    @Param('expressionContextId', new ParseUUIDPipe())
    expressionContextId: string,
  ) {
    return await this.dictionaryApiService.generateDefinitionOfExpressionContext(
      expressionContextId,
    );
  }

  @ApiBearerAuth('admin-auth')
  @ApiOperation({ summary: 'Generate sentences for the expression context' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sentences generated successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          sentence: { type: 'string' },
          translation: { type: 'string' },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Expression context or expression not found',
  })
  @Get('ai/expression-context/:expressionContextId/generate-sentences')
  async generateSentencesForExpressionContext(
    @Param('expressionContextId', new ParseUUIDPipe())
    expressionContextId: string,
  ) {
    return await this.dictionaryApiService.generateSentencesOfExpressionContext(
      expressionContextId,
    );
  }
}
