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
    }
  }
}
