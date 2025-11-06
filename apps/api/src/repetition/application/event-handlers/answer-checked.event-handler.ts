import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { IntegrationEvent } from '../../../common/outbox/types';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';

type EventPayload = {
  expressionContextId: string;
  sentenceId?: string;
  correct: boolean;
  userId: string;
};

@EventsHandler(IntegrationEvent)
export class AnswerCheckedEventHandler
  implements IEventHandler<IntegrationEvent<EventPayload>>
{
  private readonly logger = new Logger(
    `Repetition Domain - ${AnswerCheckedEventHandler.name}`,
  );

  constructor(private readonly prismaService: PrismaService) {}

  async handle(event: IntegrationEvent<EventPayload>) {
    if (event.type !== 'answer.answer-checked') return;
    this.logger.debug(JSON.stringify(event));
    const { correct, userId, expressionContextId } = event.payload;

    if (!correct) {
      await this.whenAnswerIsIncorrect(userId, expressionContextId);
      return;
    }

    await this.whenAnswerIsCorrect(userId, expressionContextId);
  }

  private async whenAnswerIsIncorrect(
    userId: string,
    expressionContextId: string,
  ) {
    const repetition = await this.prismaService.repetition.findUnique({
      where: {
        expressionContextId_userId: {
          expressionContextId,
          userId,
        },
      },
    });

    if (!repetition) {
      await this.prismaService.repetition.create({
        data: {
          userId,
          expressionContextId,
          nextRepetition: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });
      return;
    }

    if (repetition && repetition.nextRepetition.getTime() < Date.now()) {
      await this.prismaService.repetition.update({
        where: { id: repetition.id },
        data: {
          nextRepetition: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });
      return;
    }
  }

  private async whenAnswerIsCorrect(
    userId: string,
    expressionContextId: string,
  ) {
    const repetition = await this.prismaService.repetition.findUnique({
      where: {
        expressionContextId_userId: {
          expressionContextId,
          userId,
        },
      },
    });

    if (!repetition) return;

    if (repetition.nextRepetition.getTime() < Date.now()) {
      await this.prismaService.repetition.delete({
        where: { id: repetition.id },
      });
    }
  }
}
