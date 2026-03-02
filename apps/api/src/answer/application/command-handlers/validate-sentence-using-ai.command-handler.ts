import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ValidateSentenceUsingAiCommand } from '../commands/validate-sentence-using-ai.command';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { AppError } from '../../../common/errors';
import { AiService } from '../ports/ai.service';
import { IntegrationEvent } from '../../../common/outbox/types';
import { OutboxService } from '../../../common/outbox/outbox.service';

export type ValidateSentenceUsingAiCommandResponse = {
  score: number;
  answer: string;
};

@CommandHandler(ValidateSentenceUsingAiCommand)
export class ValidateSentenceUsingAiCommandHandler implements ICommandHandler<
  ValidateSentenceUsingAiCommand,
  ValidateSentenceUsingAiCommandResponse
> {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly aiService: AiService,
    private readonly outboxService: OutboxService,
  ) {}

  async execute(
    command: ValidateSentenceUsingAiCommand,
  ): Promise<ValidateSentenceUsingAiCommandResponse> {
    const { userId, userSentence, expressionContextId } = command;

    const expressionContext =
      await this.prismaService.answerExpressionContextReadModel.findUnique({
        where: { expressionContextId },
      });

    if (!expressionContext)
      throw new AppError('ENTITY_NOT_FOUND', `Expression context not found`);

    try {
      const aiAnswer = await this.aiService.validateSentence(
        expressionContext.phrase,
        expressionContext.translation,
        expressionContext.type,
        userSentence,
      );

      const event: IntegrationEvent<{
        expressionContextId: string;
        sentenceId?: string;
        correct: boolean;
        userId: string;
      }> = new IntegrationEvent(
        'answer.answer-checked',
        {
          correct: aiAnswer.score > 0.8,
          expressionContextId,
          userId,
        },
        {
          aggregateId: expressionContext.expressionContextId,
        },
      );

      await this.outboxService.enqueue(event, this.prismaService);

      return aiAnswer;
    } catch (e) {
      console.log(e); // todo;
      throw new AppError('SIMPLE_ERROR', 'Error validating sentence using AI.');
    }
  }
}
