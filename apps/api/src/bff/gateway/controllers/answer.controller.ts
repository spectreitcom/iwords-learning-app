import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AnswerApiService } from '../../../answer/application/services/answer-api.service';
import { CheckAnswerForSimpleTranslationDto } from '../dtos/check-answer-for-simple-translation.dto';
import { CheckAnswerForIrregularVerbDto } from '../dtos/check-answer-for-irregular-verb.dto';
import { CheckAnswerForSentenceDto } from '../dtos/check-answer-for-sentence.dto';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';

@UseGuards(ClerkAuthGuard)
@ApiTags('App Answers')
@Controller('answers')
export class AnswerController {
  constructor(private readonly answerApiService: AnswerApiService) {}

  @ApiBearerAuth('app-auth')
  @ApiOperation({ summary: 'Check answer for simple translation' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Checked answer',
    schema: {
      type: 'object',
      properties: {
        correct: { type: 'boolean' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation error',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Expression context not found',
  })
  @Post('simple-translation')
  @HttpCode(HttpStatus.OK)
  async checkAnswerForSimpleTranslation(
    @Body() payload: CheckAnswerForSimpleTranslationDto,
  ) {
    return await this.answerApiService.checkAnswerForSimpleTranslation(
      payload.answer,
      payload.expressionContextId,
    );
  }

  @ApiBearerAuth('app-auth')
  @ApiOperation({ summary: 'Check answer for irregular verb' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Checked answer',
    schema: {
      type: 'object',
      properties: {
        form1: { type: 'object', properties: { correct: { type: 'boolean' } } },
        form2: { type: 'object', properties: { correct: { type: 'boolean' } } },
        form3: { type: 'object', properties: { correct: { type: 'boolean' } } },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation error',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Expression context not found',
  })
  @Post('irregular-verb')
  @HttpCode(HttpStatus.OK)
  async checkAnswerForIrregularVerb(
    @Body() payload: CheckAnswerForIrregularVerbDto,
  ) {
    return await this.answerApiService.checkAnswerForIrregularVerb(
      payload.answer,
      payload.expressionContextId,
    );
  }

  @ApiBearerAuth('app-auth')
  @ApiOperation({ summary: 'Check answer for sentence' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Checked answer',
    schema: {
      type: 'object',
      properties: {
        correct: { type: 'boolean' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation error',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Expression context not found',
  })
  @Post('sentence')
  @HttpCode(HttpStatus.OK)
  async checkAnswerForSentence(@Body() payload: CheckAnswerForSentenceDto) {
    return await this.answerApiService.checkAnswerForSentence(
      payload.answer,
      payload.sentenceId,
    );
  }
}
