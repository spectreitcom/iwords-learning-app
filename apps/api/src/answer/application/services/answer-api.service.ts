import { Injectable } from '@nestjs/common';
import { AnswerApi } from '../ports/answer.api';
import { CheckAnswerForIrregularVerbCommandResponse } from '../command-handlers/check-answer-for-irregular-verb.command-handler';
import { CheckAnswerForSentenceCommandResponse } from '../command-handlers/check-answer-for-sentence.command-handler';
import { CheckAnswerForSimpleTranslationCommandResponse } from '../command-handlers/check-answer-for-simple-translation.command-handler';
import { CommandBus } from '@nestjs/cqrs';
import { CheckAnswerForSimpleTranslationCommand } from '../commands/check-answer-for-simple-translation.command';
import { CheckAnswerForIrregularVerbCommand } from '../commands/check-answer-for-irregular-verb.command';
import { CheckAnswerForSentenceCommand } from '../commands/check-answer-for-sentence.command';

@Injectable()
export class AnswerApiService implements AnswerApi {
  constructor(private readonly commandBus: CommandBus) {}

  async checkAnswerForSimpleTranslation(
    answer: string,
    expressionContextId: string,
  ): Promise<CheckAnswerForSimpleTranslationCommandResponse> {
    const command = new CheckAnswerForSimpleTranslationCommand(
      answer,
      expressionContextId,
    );
    return await this.commandBus.execute(command);
  }

  async checkAnswerForIrregularVerb(
    answer: [string, string, string],
    expressionContextId: string,
  ): Promise<CheckAnswerForIrregularVerbCommandResponse> {
    const command = new CheckAnswerForIrregularVerbCommand(
      answer,
      expressionContextId,
    );
    return await this.commandBus.execute(command);
  }

  async checkAnswerForSentence(
    answer: string,
    sentenceId: string,
  ): Promise<CheckAnswerForSentenceCommandResponse> {
    const command = new CheckAnswerForSentenceCommand(answer, sentenceId);
    return await this.commandBus.execute(command);
  }
}
