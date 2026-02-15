import { Box } from '../box';
import { BoxId } from '../value-objects/box-id';
import { ExpressionContextId } from '../value-objects/expression-context-id';
import { BoxCreatedEvent } from '../events/box-created.event';
import { BoxUpdatedEvent } from '../events/box-updated.event';
import { ExpressionContextIdAddedEvent } from '../events/expression-context-id-added.event';
import { ExpressionContextIdRemovedEvent } from '../events/expression-context-id-removed.event';
import { BoxDeletedEvent } from '../events/box-deleted.event';
import {
  ExpressionContextIdAlreadyExists,
  ExpressionContextsQuantityExceeded,
} from '../errors';

describe('Box', () => {
  describe('create', () => {
    it('should create a new box with generated id and empty expression context ids', () => {
      const title = 'Test Box';

      const box = Box.create(title);

      expect(box.getTitle()).toBe(title);
      expect(box.getBoxId()).toBeInstanceOf(BoxId);
      expect(box.getExpressionContextIds()).toEqual([]);
      expect(box.getUncommittedEvents()).toHaveLength(1);

      const event = box.getUncommittedEvents()[0] as BoxCreatedEvent;
      expect(event).toBeInstanceOf(BoxCreatedEvent);
      expect(event.boxId).toBe(box.getBoxId().value);
      expect(event.title).toBe(title);
      expect(event.expressionContextIds).toEqual([]);
    });
  });

  describe('constructor', () => {
    it('should create a box with provided parameters', () => {
      const boxId = BoxId.create();
      const title = 'Test Box';
      const expressionContextIds = [
        ExpressionContextId.fromString('550e8400-e29b-41d4-a716-446655440001'),
        ExpressionContextId.fromString('550e8400-e29b-41d4-a716-446655440002'),
      ];

      const box = new Box(boxId, title, expressionContextIds);

      expect(box.getBoxId()).toBe(boxId);
      expect(box.getTitle()).toBe(title);
      expect(box.getExpressionContextIds()).toBe(expressionContextIds);
    });
  });

  describe('update', () => {
    it('should update the box title and publish BoxUpdatedEvent', () => {
      const box = Box.create('Initial Title');

      const newTitle = 'Updated Title';

      box.update(newTitle);

      expect(box.getTitle()).toBe(newTitle);
      expect(box.getUncommittedEvents()).toHaveLength(2); // Creation + Update events

      const event = box.getUncommittedEvents()[1] as BoxUpdatedEvent;
      expect(event).toBeInstanceOf(BoxUpdatedEvent);
      expect(event.boxId).toBe(box.getBoxId().value);
      expect(event.title).toBe(newTitle);
    });
  });

  describe('addExpressionContextId', () => {
    it('should add expression context id and publish ExpressionContextAddedEvent', () => {
      const box = Box.create('Test Box');

      const expressionContextId = '550e8400-e29b-41d4-a716-446655440001';

      box.addExpressionContextId(expressionContextId);

      expect(box.getExpressionContextIds()).toHaveLength(1);
      expect(box.getExpressionContextIds()[0].value).toBe(expressionContextId);
      expect(box.getUncommittedEvents()).toHaveLength(2); // Creation + Add events

      const event =
        box.getUncommittedEvents()[1] as ExpressionContextIdAddedEvent;
      expect(event).toBeInstanceOf(ExpressionContextIdAddedEvent);
      expect(event.boxId).toBe(box.getBoxId().value);
      expect(event.expressionContextId).toBe(expressionContextId);
    });

    it('should throw ExpressionContextIdAlreadyExists when adding duplicate expression context id', () => {
      const box = Box.create('Test Box');
      const expressionContextId = '550e8400-e29b-41d4-a716-446655440001';

      box.addExpressionContextId(expressionContextId);

      expect(() => {
        box.addExpressionContextId(expressionContextId);
      }).toThrow(ExpressionContextIdAlreadyExists);
    });

    it('should allow adding different expression context ids', () => {
      const box = Box.create('Test Box');

      const contextId1 = '550e8400-e29b-41d4-a716-446655440001';
      const contextId2 = '550e8400-e29b-41d4-a716-446655440002';

      box.addExpressionContextId(contextId1);
      box.addExpressionContextId(contextId2);

      expect(box.getExpressionContextIds()).toHaveLength(2);
      expect(box.getExpressionContextIds()[0].value).toBe(contextId1);
      expect(box.getExpressionContextIds()[1].value).toBe(contextId2);
      expect(box.getUncommittedEvents()).toHaveLength(3); // Creation + 2 Add events
    });

    it('should allow adding exactly 5 expression context ids', () => {
      const box = Box.create('Test Box');

      box.addExpressionContextId('550e8400-e29b-41d4-a716-446655440001');
      box.addExpressionContextId('550e8400-e29b-41d4-a716-446655440002');
      box.addExpressionContextId('550e8400-e29b-41d4-a716-446655440003');
      box.addExpressionContextId('550e8400-e29b-41d4-a716-446655440004');
      box.addExpressionContextId('550e8400-e29b-41d4-a716-446655440005');

      expect(box.getExpressionContextIds()).toHaveLength(5);
    });

    it('should throw ExpressionContextsQuantityExceeded when adding more than 5 expression context ids', () => {
      const box = Box.create('Test Box');

      box.addExpressionContextId('550e8400-e29b-41d4-a716-446655440001');
      box.addExpressionContextId('550e8400-e29b-41d4-a716-446655440002');
      box.addExpressionContextId('550e8400-e29b-41d4-a716-446655440003');
      box.addExpressionContextId('550e8400-e29b-41d4-a716-446655440004');
      box.addExpressionContextId('550e8400-e29b-41d4-a716-446655440005');

      expect(() => {
        box.addExpressionContextId('550e8400-e29b-41d4-a716-446655440006');
      }).toThrow(ExpressionContextsQuantityExceeded);
    });
  });

  describe('removeExpressionContextId', () => {
    it('should remove expression context id and publish ExpressionContextRemovedEvent', () => {
      const box = Box.create('Test Box');
      const expressionContextId = '550e8400-e29b-41d4-a716-446655440001';

      box.addExpressionContextId(expressionContextId);
      box.removeExpressionContextId(expressionContextId);

      expect(box.getExpressionContextIds()).toHaveLength(0);
      expect(box.getUncommittedEvents()).toHaveLength(3); // Creation + Add + Remove events

      const event =
        box.getUncommittedEvents()[2] as ExpressionContextIdRemovedEvent;
      expect(event).toBeInstanceOf(ExpressionContextIdRemovedEvent);
      expect(event.boxId).toBe(box.getBoxId().value);
      expect(event.expressionContextId).toBe(expressionContextId);
    });

    it('should handle removing non-existing expression context id gracefully', () => {
      const box = Box.create('Test Box');

      const expressionContextId = '550e8400-e29b-41d4-a716-446655440003';

      expect(() => {
        box.removeExpressionContextId(expressionContextId);
      }).not.toThrow();

      expect(box.getUncommittedEvents()).toHaveLength(2); // Creation + Remove events

      const event =
        box.getUncommittedEvents()[1] as ExpressionContextIdRemovedEvent;
      expect(event).toBeInstanceOf(ExpressionContextIdRemovedEvent);
      expect(event.boxId).toBe(box.getBoxId().value);
      expect(event.expressionContextId).toBe(expressionContextId);
    });
  });

  describe('delete', () => {
    it('should publish BoxDeletedEvent when deleting a box', () => {
      const box = Box.create('Test Box');

      box.delete();

      expect(box.getUncommittedEvents()).toHaveLength(2); // Creation + Delete events

      const event = box.getUncommittedEvents()[1] as BoxDeletedEvent;
      expect(event).toBeInstanceOf(BoxDeletedEvent);
      expect(event.boxId).toBe(box.getBoxId().value);
    });

    it('should publish BoxDeletedEvent for a box with expression context ids', () => {
      const box = Box.create('Test Box');
      const expressionContextId = '550e8400-e29b-41d4-a716-446655440001';

      box.addExpressionContextId(expressionContextId);
      box.delete();

      expect(box.getUncommittedEvents()).toHaveLength(3); // Creation + Add + Delete events

      const event = box.getUncommittedEvents()[2] as BoxDeletedEvent;
      expect(event).toBeInstanceOf(BoxDeletedEvent);
      expect(event.boxId).toBe(box.getBoxId().value);
    });
  });

  describe('getters', () => {
    it('should return correct box id', () => {
      const boxId = BoxId.create();
      const box = new Box(boxId, 'Test', []);

      expect(box.getBoxId()).toBe(boxId);
    });

    it('should return correct title', () => {
      const title = 'Test Box Title';
      const box = new Box(BoxId.create(), title, []);

      expect(box.getTitle()).toBe(title);
    });

    it('should return correct expression context ids', () => {
      const expressionContextIds = [
        ExpressionContextId.fromString('550e8400-e29b-41d4-a716-446655440001'),
        ExpressionContextId.fromString('550e8400-e29b-41d4-a716-446655440002'),
      ];
      const box = new Box(BoxId.create(), 'Test', expressionContextIds);

      expect(box.getExpressionContextIds()).toBe(expressionContextIds);
    });
  });
});
