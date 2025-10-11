import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CheckAnswerForIrregularVerbCommand } from '../commands/check-answer-for-irregular-verb.command';
import { PrismaService } from '../../../common/prisma/prisma.service';

export type CheckAnswerForIrregularVerbCommandResponse = {
  form1: { correct: boolean };
  form2: { correct: boolean };
  form3: { correct: boolean };
};

@CommandHandler(CheckAnswerForIrregularVerbCommand)
export class CheckAnswerForIrregularVerbCommandHandler
  implements
    ICommandHandler<
      CheckAnswerForIrregularVerbCommand,
      CheckAnswerForIrregularVerbCommandResponse
    >
{
  constructor(private readonly prismaService: PrismaService) {}

  async execute(
    command: CheckAnswerForIrregularVerbCommand,
  ): Promise<CheckAnswerForIrregularVerbCommandResponse> {
    const { answer, expressionContextId } = command;

    const answerExpressionContext =
      await this.prismaService.answerExpressionContextReadModel.findUnique({
        where: { expressionContextId },
      });

    if (!answerExpressionContext) {
      throw new Error(
        `Answer expression context with id ${expressionContextId} not found`,
      );
    }

    const { forms } = answerExpressionContext;

    const form1 = forms[0];
    const form2 = forms[1];
    const form3 = forms[2];

    return {
      form1: { correct: form1 === answer[0] },
      form2: { correct: form2 === answer[1] },
      form3: { correct: form3 === answer[2] },
    };
  }
}
