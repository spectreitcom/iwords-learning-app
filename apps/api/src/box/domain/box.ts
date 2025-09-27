import { AggregateRoot } from '@nestjs/cqrs';
import { BoxId } from './value-objects/box-id';
import { ExpressionContextId } from './value-objects/expression-context-id';
import { BoxCreatedEvent } from './events/box-created.event';
import { ExpressionContextIdAlreadyExists } from './errors';
import { ExpressionContextIdAddedEvent } from './events/expression-context-id-added.event';
import { BoxUpdatedEvent } from './events/box-updated.event';
import { ExpressionContextIdRemovedEvent } from './events/expression-context-id-removed.event';

export class Box extends AggregateRoot {
  private readonly boxId: BoxId;
  private title: string;
  private readonly expressionContextIds: ExpressionContextId[];

  constructor(
    boxId: BoxId,
    title: string,
    expressionContextIds: ExpressionContextId[],
  ) {
    super();
    this.boxId = boxId;
    this.title = title;
    this.expressionContextIds = expressionContextIds;
  }

  static create(title: string) {
    const boxId = BoxId.create();
    const box = new Box(boxId, title, []);

    box.apply(new BoxCreatedEvent(box.getBoxId().value, box.getTitle(), []));

    return box;
  }

  update(title: string) {
    this.title = title;
    this.apply(new BoxUpdatedEvent(this.boxId.value, this.title));
  }

  addExpressionContextId(expressionContextId: string) {
    const expressionContextIdValueObject =
      ExpressionContextId.fromString(expressionContextId);

    for (const expressionContextId of this.expressionContextIds) {
      if (expressionContextId.equals(expressionContextIdValueObject)) {
        throw new ExpressionContextIdAlreadyExists(expressionContextId.value);
      }
    }

    this.expressionContextIds.push(expressionContextIdValueObject);

    this.apply(
      new ExpressionContextIdAddedEvent(this.boxId.value, expressionContextId),
    );
  }

  removeExpressionContextId(expressionContextId: string) {
    const expressionContextIdValueObject =
      ExpressionContextId.fromString(expressionContextId);

    const index = this.expressionContextIds.findIndex((existingId) =>
      existingId.equals(expressionContextIdValueObject),
    );

    if (index > -1) {
      this.expressionContextIds.splice(index, 1);
    }

    this.apply(
      new ExpressionContextIdRemovedEvent(
        this.boxId.value,
        expressionContextId,
      ),
    );
  }

  getBoxId() {
    return this.boxId;
  }

  getTitle() {
    return this.title;
  }

  getExpressionContextIds() {
    return this.expressionContextIds;
  }
}
