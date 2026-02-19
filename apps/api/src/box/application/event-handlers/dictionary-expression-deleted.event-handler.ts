import { EventPublisher, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { IntegrationEvent } from '../../../common/outbox/types';
import { Logger } from '@nestjs/common';
import { BoxRepository } from '../ports/box.repository';

type EventPayload = {
  id: string;
  expressionContextIds: string[];
};

@EventsHandler(IntegrationEvent)
export class DictionaryExpressionDeletedEventHandler implements IEventHandler<
  IntegrationEvent<EventPayload>
> {
  private readonly logger = new Logger(
    `Box Domain - ${DictionaryExpressionDeletedEventHandler.name}`,
  );

  constructor(
    private readonly boxRepository: BoxRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async handle(event: IntegrationEvent<EventPayload>) {
    if (event.type !== 'dictionary.expression-deleted') return;
    this.logger.debug(JSON.stringify(event));

    const { expressionContextIds } = event.payload;

    const boxes =
      await this.boxRepository.findByExpressionContextIds(expressionContextIds);

    for (const box of boxes) {
      this.eventPublisher.mergeObjectContext(box);
      for (const expressionContextId of expressionContextIds) {
        box.removeExpressionContextId(expressionContextId);
      }
      await this.boxRepository.save(box);
      box.commit();
    }
  }
}
