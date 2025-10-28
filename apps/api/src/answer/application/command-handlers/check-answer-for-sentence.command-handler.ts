import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CheckAnswerForSentenceCommand } from '../commands/check-answer-for-sentence.command';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { AppError } from '../../../common/errors';

export type CheckAnswerForSentenceCommandResponse = {
  correct: boolean;
  userAnswer: string;
  correctAnswer: string;
};

@CommandHandler(CheckAnswerForSentenceCommand)
export class CheckAnswerForSentenceCommandHandler
  implements
    ICommandHandler<
      CheckAnswerForSentenceCommand,
      CheckAnswerForSentenceCommandResponse
    >
{
  constructor(private readonly prismaService: PrismaService) {}

  async execute(
    command: CheckAnswerForSentenceCommand,
  ): Promise<CheckAnswerForSentenceCommandResponse> {
    const { answer, sentenceId } = command;

    const answerSentence =
      await this.prismaService.answerSentenceReadModel.findUnique({
        where: { sentenceId },
      });

    if (!answerSentence) {
      throw new AppError(
        'ENTITY_NOT_FOUND',
        `Answer sentence with id ${sentenceId} not found`,
      );
    }

    return {
      correct: answer === answerSentence.content,
      userAnswer: answer,
      correctAnswer: answerSentence.content,
    };
  }
}
