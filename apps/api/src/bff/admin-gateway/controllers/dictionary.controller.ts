import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
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
import {
  ExpressionNotFoundError,
  ExpressionPhraseAlreadyTakenError,
} from '../../../dictionary/application/errors';
import { CreateVerbExpressionContextDto } from '../dtos/create-verb-expression-context.dto';
import { CreatePhrasalVerbExpressionContextDto } from '../dtos/create-phrasal-verb-expression-context.dto';

@ApiTags('Admin Dictionary')
@Controller('admin/dictionary')
export class DictionaryController {
  constructor(private readonly dictionaryApiService: DictionaryApiService) {}

  @ApiBearerAuth('admin-auth')
  @ApiOperation({ summary: 'Create expression' })
  @ApiResponse({
    status: 201,
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
  @ApiResponse({ status: 200, description: 'Expression updated successfully' })
  @ApiResponse({ status: 404, description: 'Expression not found' })
  @ApiResponse({ status: 400, description: 'Expression phrase already taken' })
  @Put('expressions/:expressionId')
  @HttpCode(HttpStatus.OK)
  async updateExpression(
    @Body() payload: UpdateExpressionDto,
    @Param('expressionId', new ParseUUIDPipe()) expressionId: string,
  ) {
    try {
      return await this.dictionaryApiService.updateExpression(
        expressionId,
        payload.phrase,
      );
    } catch (e) {
      if (e instanceof ExpressionNotFoundError) {
        throw new NotFoundException(e.message);
      }
      if (e instanceof ExpressionPhraseAlreadyTakenError) {
        throw new BadRequestException(e.message);
      }
      throw e;
    }
  }

  @ApiBearerAuth('admin-auth')
  @ApiOperation({ summary: 'Create verb expression context' })
  @ApiResponse({
    status: 201,
    description: 'Expression context created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Expression not found' })
  @Post('expression-contexts/verb')
  @HttpCode(HttpStatus.CREATED)
  async createVerbExpressionContext(
    @Body() payload: CreateVerbExpressionContextDto,
  ) {
    try {
      return await this.dictionaryApiService.createVerbExpressionContext(
        payload.expressionId,
        payload.translation,
      );
    } catch (e) {
      if (e instanceof ExpressionNotFoundError) {
        throw new NotFoundException(e.message);
      }
      throw e;
    }
  }

  @ApiBearerAuth('admin-auth')
  @ApiOperation({ summary: 'Create phrasal verb expression context' })
  @ApiResponse({
    status: 201,
    description: 'Expression context created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Expression not found' })
  @Post('expression-contexts/phrasal-verb')
  @HttpCode(HttpStatus.CREATED)
  async createPhrasalVerbExpressionContext(
    @Body() payload: CreatePhrasalVerbExpressionContextDto,
  ) {
    try {
      return await this.dictionaryApiService.createPhrasalVerbExpressionContext(
        payload.expressionId,
        payload.translation,
      );
    } catch (e) {
      if (e instanceof ExpressionNotFoundError) {
        throw new NotFoundException(e.message);
      }
      throw e;
    }
  }
}
