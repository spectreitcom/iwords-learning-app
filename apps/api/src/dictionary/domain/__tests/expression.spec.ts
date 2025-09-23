import { Expression } from '../expression';
import { ExpressionId } from '../value-objects/expression-id';
import { ExpressionCreatedEvent } from '../events/expression-created.event';
import { ExpressionPhraseUpdatedEvent } from '../events/expression-phrase-updated.event';
import { ExpressionDeletedEvent } from '../events/expression-deleted.event';

describe('Expression', () => {
  describe('constructor', () => {
    it('should create an Expression with given expressionId and phrase', () => {
      const testId = '550e8400-e29b-41d4-a716-446655440000';
      const expression = new Expression(testId, 'hello world');

      expect(expression.getExpressionId().value).toBe(testId);
      expect(expression.getPhrase()).toBe('hello world');
    });

    it('should create an Expression with ExpressionId value object', () => {
      const testId = '550e8400-e29b-41d4-a716-446655440001';
      const expression = new Expression(testId, 'hello world');

      expect(expression.getExpressionId()).toBeInstanceOf(ExpressionId);
      expect(expression.getExpressionId().value).toBe(testId);
    });
  });

  describe('create', () => {
    it('should create a new Expression with generated ID', () => {
      const phrase = 'test phrase';
      const expression = Expression.create(phrase);

      expect(expression.getExpressionId()).toBeInstanceOf(ExpressionId);
      expect(expression.getExpressionId().value).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
      expect(expression.getPhrase()).toBe(phrase);
    });

    it('should apply ExpressionCreatedEvent when creating', () => {
      const phrase = 'test phrase';
      const expression = Expression.create(phrase);

      const uncommittedEvents = expression.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(1);
      expect(uncommittedEvents[0]).toBeInstanceOf(ExpressionCreatedEvent);
      const event = uncommittedEvents[0] as ExpressionCreatedEvent;
      expect(event.expressionId).toBe(expression.getExpressionId().value);
      expect(event.phrase).toBe(phrase);
    });

    it('should create Expression with empty phrase', () => {
      const expression = Expression.create('');

      expect(expression.getPhrase()).toBe('');
      expect(expression.getExpressionId()).toBeInstanceOf(ExpressionId);
    });

    it('should create Expression with whitespace phrase', () => {
      const phrase = '   ';
      const expression = Expression.create(phrase);

      expect(expression.getPhrase()).toBe(phrase);
      expect(expression.getExpressionId()).toBeInstanceOf(ExpressionId);
    });
  });

  describe('updatePhrase', () => {
    let expression: Expression;
    const testId = '550e8400-e29b-41d4-a716-446655440002';
    const originalPhrase = 'original phrase';

    beforeEach(() => {
      expression = new Expression(testId, originalPhrase);
    });

    it('should update phrase and apply ExpressionPhraseUpdatedEvent', () => {
      const newPhrase = 'updated phrase';
      expression.updatePhrase(newPhrase);

      expect(expression.getPhrase()).toBe(newPhrase);

      const uncommittedEvents = expression.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(1);
      expect(uncommittedEvents[0]).toBeInstanceOf(ExpressionPhraseUpdatedEvent);
      const event = uncommittedEvents[0] as ExpressionPhraseUpdatedEvent;
      expect(event.expressionId).toBe(testId);
      expect(event.oldPhrase).toBe(originalPhrase);
      expect(event.newPhrase).toBe(newPhrase);
    });

    it('should handle updating to empty phrase', () => {
      expression.updatePhrase('');

      expect(expression.getPhrase()).toBe('');

      const uncommittedEvents = expression.getUncommittedEvents();
      const event = uncommittedEvents[0] as ExpressionPhraseUpdatedEvent;
      expect(event.expressionId).toBe(testId);
      expect(event.oldPhrase).toBe(originalPhrase);
      expect(event.newPhrase).toBe('');
    });

    it('should handle updating to same phrase', () => {
      expression.updatePhrase(originalPhrase);

      expect(expression.getPhrase()).toBe(originalPhrase);

      const uncommittedEvents = expression.getUncommittedEvents();
      const event = uncommittedEvents[0] as ExpressionPhraseUpdatedEvent;
      expect(event.expressionId).toBe(testId);
      expect(event.oldPhrase).toBe(originalPhrase);
      expect(event.newPhrase).toBe(originalPhrase);
    });

    it('should handle multiple phrase updates', () => {
      const firstUpdate = 'first update';
      const secondUpdate = 'second update';

      expression.updatePhrase(firstUpdate);
      expression.updatePhrase(secondUpdate);

      expect(expression.getPhrase()).toBe(secondUpdate);

      const uncommittedEvents = expression.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(2);
      const secondEvent = uncommittedEvents[1] as ExpressionPhraseUpdatedEvent;
      expect(secondEvent.expressionId).toBe(testId);
      expect(secondEvent.oldPhrase).toBe(firstUpdate);
      expect(secondEvent.newPhrase).toBe(secondUpdate);
    });
  });

  describe('delete', () => {
    let expression: Expression;
    const testId = '550e8400-e29b-41d4-a716-446655440003';

    beforeEach(() => {
      expression = new Expression(testId, 'test phrase');
    });

    it('should apply ExpressionDeletedEvent when deleting', () => {
      expression.delete();

      const uncommittedEvents = expression.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(1);
      expect(uncommittedEvents[0]).toBeInstanceOf(ExpressionDeletedEvent);
      const event = uncommittedEvents[0] as ExpressionDeletedEvent;
      expect(event.expressionId).toBe(testId);
    });

    it('should allow multiple delete calls', () => {
      expression.delete();
      expression.delete();

      const uncommittedEvents = expression.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(2);
      expect(uncommittedEvents[0]).toBeInstanceOf(ExpressionDeletedEvent);
      expect(uncommittedEvents[1]).toBeInstanceOf(ExpressionDeletedEvent);
    });
  });

  describe('getExpressionId', () => {
    it('should return the ExpressionId value object', () => {
      const testId = '550e8400-e29b-41d4-a716-446655440004';
      const expression = new Expression(testId, 'test phrase');

      expect(expression.getExpressionId()).toBeInstanceOf(ExpressionId);
      expect(expression.getExpressionId().value).toBe(testId);
    });
  });

  describe('getPhrase', () => {
    it('should return the current phrase', () => {
      const phrase = 'test phrase';
      const testId = '550e8400-e29b-41d4-a716-446655440005';
      const expression = new Expression(testId, phrase);

      expect(expression.getPhrase()).toBe(phrase);
    });

    it('should return updated phrase after update', () => {
      const testId = '550e8400-e29b-41d4-a716-446655440006';
      const expression = new Expression(testId, 'original');
      const newPhrase = 'updated phrase';

      expression.updatePhrase(newPhrase);

      expect(expression.getPhrase()).toBe(newPhrase);
    });
  });

  describe('complex scenarios', () => {
    it('should handle create, update, and delete sequence', () => {
      const expression = Expression.create('initial phrase');
      expression.updatePhrase('updated phrase');
      expression.delete();

      const uncommittedEvents = expression.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(3);
      expect(uncommittedEvents[0]).toBeInstanceOf(ExpressionCreatedEvent);
      expect(uncommittedEvents[1]).toBeInstanceOf(ExpressionPhraseUpdatedEvent);
      expect(uncommittedEvents[2]).toBeInstanceOf(ExpressionDeletedEvent);
    });

    it('should maintain phrase state after delete', () => {
      const testId = '550e8400-e29b-41d4-a716-446655440007';
      const expression = new Expression(testId, 'test phrase');
      expression.delete();

      expect(expression.getPhrase()).toBe('test phrase');
    });

    it('should handle special characters in phrase', () => {
      const specialPhrase = 'Hello! @#$%^&*()_+ 世界 🌍';
      const expression = Expression.create(specialPhrase);

      expect(expression.getPhrase()).toBe(specialPhrase);

      const newSpecialPhrase = 'Ñoño café naïve résumé 中文';
      expression.updatePhrase(newSpecialPhrase);

      expect(expression.getPhrase()).toBe(newSpecialPhrase);
    });
  });
});
