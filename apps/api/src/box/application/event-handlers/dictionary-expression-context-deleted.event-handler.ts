import { EventPublisher, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { IntegrationEvent } from '../../../common/outbox/types';
import { Logger } from '@nestjs/common';
import { BoxRepository } from '../ports/box.repository';

type EventPayload = {
  expressionContextId: string;
};

@EventsHandler(IntegrationEvent)
export class DictionaryExpressionContextDeletedEventHandler
  implements IEventHandler<IntegrationEvent<EventPayload>>
{
  private readonly logger = new Logger(
    `Box Domain - ${DictionaryExpressionContextDeletedEventHandler.name}`,
  );

  constructor(
    private readonly boxRepository: BoxRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async handle(event: IntegrationEvent<EventPayload>) {
    if (event.type !== 'dictionary.expression-context-deleted') return;
    this.logger.debug(JSON.stringify(event));

    const { expressionContextId } = event.payload;

    const boxes =
      await this.boxRepository.findByExpressionContextId(expressionContextId);

    // this is acceptable, no more than one box can have the same expression context id
    for (const box of boxes) {
      this.eventPublisher.mergeObjectContext(box);
      box.removeExpressionContextId(expressionContextId);
      await this.boxRepository.save(box);
      box.commit();
    }
  }
}
