import { Expression } from '../expression';
import { ExpressionId } from '../value-objects/expression-id';
import { ExpressionCreatedEvent } from '../events/expression-created.event';
import { ExpressionPhraseUpdatedEvent } from '../events/expression-phrase-updated.event';
import { ExpressionDeletedEvent } from '../events/expression-deleted.event';
import { randomUUID } from 'node:crypto';

describe('Expression', () => {
  describe('constructor', () => {
    it('should create an expression with valid id and phrase', () => {
      const expressionId = randomUUID();
      const phrase = 'hello world';

      const expression = new Expression(expressionId, phrase);

      expect(expression.getExpressionId().value).toBe(expressionId);
      expect(expression.getPhrase()).toBe(phrase);
      expect(expression.shouldBeDeleted()).toBe(false);
    });
  });

  describe('create', () => {
    it('should create a new expression and apply ExpressionCreatedEvent', () => {
      const phrase = 'test phrase';

      const applySpy = jest.spyOn(Expression.prototype, 'apply');
      const expression = Expression.create(phrase);

      expect(expression.getPhrase()).toBe(phrase);
      expect(expression.shouldBeDeleted()).toBe(false);
      expect(applySpy).toHaveBeenCalledWith(expect.any(ExpressionCreatedEvent));

      const appliedEvent = applySpy.mock.calls[0][0] as ExpressionCreatedEvent;
      expect(appliedEvent.expressionId).toBe(
        expression.getExpressionId().value,
      );
      expect(appliedEvent.phrase).toBe(phrase);

      applySpy.mockRestore();
    });

    it('should generate unique expression IDs for different expressions', () => {
      const expression1 = Expression.create('phrase 1');
      const expression2 = Expression.create('phrase 2');

      expect(expression1.getExpressionId().value).not.toBe(
        expression2.getExpressionId().value,
      );
    });
  });

  describe('updatePhrase', () => {
    it('should update phrase and apply ExpressionPhraseUpdatedEvent', () => {
      const initialPhrase = 'initial phrase';
      const newPhrase = 'updated phrase';
      const expression = new Expression(randomUUID(), initialPhrase);
      const applySpy = jest.spyOn(expression, 'apply');

      expression.updatePhrase(newPhrase);

      expect(expression.getPhrase()).toBe(newPhrase);
      expect(applySpy).toHaveBeenCalledWith(
        expect.any(ExpressionPhraseUpdatedEvent),
      );

      const appliedEvent = applySpy.mock
        .calls[0][0] as ExpressionPhraseUpdatedEvent;
      expect(appliedEvent.expressionId).toBe(
        expression.getExpressionId().value,
      );
      expect(appliedEvent.oldPhrase).toBe(initialPhrase);
      expect(appliedEvent.newPhrase).toBe(newPhrase);

      applySpy.mockRestore();
    });

    it('should handle empty phrase update', () => {
      const initialPhrase = 'initial phrase';
      const newPhrase = '';
      const expression = new Expression(randomUUID(), initialPhrase);
      const applySpy = jest.spyOn(expression, 'apply');

      expression.updatePhrase(newPhrase);

      expect(expression.getPhrase()).toBe(newPhrase);
      expect(applySpy).toHaveBeenCalledWith(
        expect.any(ExpressionPhraseUpdatedEvent),
      );

      applySpy.mockRestore();
    });

    it('should handle updating to the same phrase', () => {
      const phrase = 'same phrase';
      const expression = new Expression(randomUUID(), phrase);
      const applySpy = jest.spyOn(expression, 'apply');

      expression.updatePhrase(phrase);

      expect(expression.getPhrase()).toBe(phrase);
      expect(applySpy).toHaveBeenCalledWith(
        expect.any(ExpressionPhraseUpdatedEvent),
      );

      const appliedEvent = applySpy.mock
        .calls[0][0] as ExpressionPhraseUpdatedEvent;
      expect(appliedEvent.oldPhrase).toBe(phrase);
      expect(appliedEvent.newPhrase).toBe(phrase);

      applySpy.mockRestore();
    });
  });

  describe('delete', () => {
    it('should mark expression as deleted and apply ExpressionDeletedEvent', () => {
      const expression = new Expression(randomUUID(), 'test phrase');
      const applySpy = jest.spyOn(expression, 'apply');

      expect(expression.shouldBeDeleted()).toBe(false);

      expression.delete();

      expect(expression.shouldBeDeleted()).toBe(true);
      expect(applySpy).toHaveBeenCalledWith(expect.any(ExpressionDeletedEvent));

      const appliedEvent = applySpy.mock.calls[0][0] as ExpressionDeletedEvent;
      expect(appliedEvent.expressionId).toBe(
        expression.getExpressionId().value,
      );

      applySpy.mockRestore();
    });

    it('should remain deleted after multiple delete calls', () => {
      const expression = new Expression(randomUUID(), 'test phrase');
      const applySpy = jest.spyOn(expression, 'apply');

      expression.delete();
      expression.delete();

      expect(expression.shouldBeDeleted()).toBe(true);
      expect(applySpy).toHaveBeenCalledTimes(2);

      applySpy.mockRestore();
    });
  });

  describe('getExpressionId', () => {
    it('should return the correct ExpressionId instance', () => {
      const expressionIdString = randomUUID();
      const expression = new Expression(expressionIdString, 'test phrase');

      const expressionId = expression.getExpressionId();

      expect(expressionId).toBeInstanceOf(ExpressionId);
      expect(expressionId.value).toBe(expressionIdString);
    });
  });

  describe('getPhrase', () => {
    it('should return the current phrase', () => {
      const phrase = 'test phrase';
      const expression = new Expression(randomUUID(), phrase);

      expect(expression.getPhrase()).toBe(phrase);
    });

    it('should return updated phrase after update', () => {
      const initialPhrase = 'initial phrase';
      const newPhrase = 'updated phrase';
      const expression = new Expression(randomUUID(), initialPhrase);

      expression.updatePhrase(newPhrase);

      expect(expression.getPhrase()).toBe(newPhrase);
    });
  });

  describe('shouldBeDeleted', () => {
    it('should return false for newly created expression', () => {
      const expression = new Expression(randomUUID(), 'test phrase');

      expect(expression.shouldBeDeleted()).toBe(false);
    });

    it('should return false for expression created via static method', () => {
      const expression = Expression.create('test phrase');

      expect(expression.shouldBeDeleted()).toBe(false);
    });

    it('should return true after deletion', () => {
      const expression = new Expression(randomUUID(), 'test phrase');

      expression.delete();

      expect(expression.shouldBeDeleted()).toBe(true);
    });
  });

  describe('integration tests', () => {
    it('should handle complete lifecycle: create, update, delete', () => {
      const applySpy = jest.spyOn(Expression.prototype, 'apply');

      // Create
      const expression = Expression.create('initial phrase');
      expect(expression.getPhrase()).toBe('initial phrase');
      expect(expression.shouldBeDeleted()).toBe(false);

      // Update
      expression.updatePhrase('updated phrase');
      expect(expression.getPhrase()).toBe('updated phrase');
      expect(expression.shouldBeDeleted()).toBe(false);

      // Delete
      expression.delete();
      expect(expression.getPhrase()).toBe('updated phrase');
      expect(expression.shouldBeDeleted()).toBe(true);

      // Verify all events were applied
      expect(applySpy).toHaveBeenCalledTimes(3);
      expect(applySpy).toHaveBeenNthCalledWith(
        1,
        expect.any(ExpressionCreatedEvent),
      );
      expect(applySpy).toHaveBeenNthCalledWith(
        2,
        expect.any(ExpressionPhraseUpdatedEvent),
      );
      expect(applySpy).toHaveBeenNthCalledWith(
        3,
        expect.any(ExpressionDeletedEvent),
      );

      applySpy.mockRestore();
    });

    it('should maintain immutable expression ID throughout lifecycle', () => {
      const expression = Expression.create('test phrase');
      const originalId = expression.getExpressionId().value;

      expression.updatePhrase('new phrase');
      expect(expression.getExpressionId().value).toBe(originalId);

      expression.delete();
      expect(expression.getExpressionId().value).toBe(originalId);
    });
  });
});
