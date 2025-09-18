import { Expression } from '../expression';
import { ExpressionId } from '../value-objects/expression-id';
import { ExpressionCreatedEvent } from '../events/expression-created.event';
import { ExpressionPhraseUpdatedEvent } from '../events/expression-phrase-updated.event';
import { ExpressionDeletedEvent } from '../events/expression-deleted.event';

describe('Expression', () => {
  describe('constructor', () => {
    it('should create an expression with valid id and phrase', () => {
      // Arrange
      const expressionId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
      const phrase = 'Hello world';

      // Act
      const expression = new Expression(expressionId, phrase);

      // Assert
      expect(expression.getExpressionId().value).toBe(expressionId);
      expect(expression.getPhrase()).toBe(phrase);
    });

    it('should throw error when invalid UUID is provided', () => {
      // Arrange
      const invalidId = 'invalid-uuid';
      const phrase = 'Hello world';

      // Act & Assert
      expect(() => new Expression(invalidId, phrase)).toThrow(
        'ExpressionId is not valid',
      );
    });
  });

  describe('create', () => {
    it('should create expression with generated ID and emit ExpressionCreatedEvent', () => {
      // Arrange
      const phrase = 'Test phrase';

      // Act
      const expression = Expression.create(phrase);

      // Assert
      expect(expression.getPhrase()).toBe(phrase);
      expect(expression.getExpressionId().value).toBeDefined();
      expect(expression.getExpressionId().value).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );

      const events = expression.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(ExpressionCreatedEvent);
      expect((events[0] as ExpressionCreatedEvent).expressionId).toBe(
        expression.getExpressionId().value,
      );
      expect((events[0] as ExpressionCreatedEvent).phrase).toBe(phrase);
    });
  });

  describe('updatePhrase', () => {
    it('should update phrase and emit ExpressionPhraseUpdatedEvent', () => {
      // Arrange
      const expression = Expression.create('Original phrase');
      expression.commit(); // Clear creation event
      const newPhrase = 'Updated phrase';

      // Act
      expression.updatePhrase(newPhrase);

      // Assert
      expect(expression.getPhrase()).toBe(newPhrase);

      const events = expression.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(ExpressionPhraseUpdatedEvent);
      expect((events[0] as ExpressionPhraseUpdatedEvent).expressionId).toBe(
        expression.getExpressionId().value,
      );
      expect((events[0] as ExpressionPhraseUpdatedEvent).oldPhrase).toBe(
        'Original phrase',
      );
      expect((events[0] as ExpressionPhraseUpdatedEvent).newPhrase).toBe(
        newPhrase,
      );
    });

    it('should handle empty string phrase update', () => {
      // Arrange
      const expression = Expression.create('Original phrase');
      expression.commit();
      const newPhrase = '';

      // Act
      expression.updatePhrase(newPhrase);

      // Assert
      expect(expression.getPhrase()).toBe(newPhrase);

      const events = expression.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(ExpressionPhraseUpdatedEvent);
    });

    it('should handle updating to same phrase', () => {
      // Arrange
      const phrase = 'Same phrase';
      const expression = Expression.create(phrase);
      expression.commit();

      // Act
      expression.updatePhrase(phrase);

      // Assert
      expect(expression.getPhrase()).toBe(phrase);

      const events = expression.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(ExpressionPhraseUpdatedEvent);
      expect((events[0] as ExpressionPhraseUpdatedEvent).oldPhrase).toBe(
        phrase,
      );
      expect((events[0] as ExpressionPhraseUpdatedEvent).newPhrase).toBe(
        phrase,
      );
    });
  });

  describe('delete', () => {
    it('should emit ExpressionDeletedEvent', () => {
      // Arrange
      const expression = Expression.create('Test phrase');
      expression.commit(); // Clear creation event

      // Act
      expression.delete();

      // Assert
      const events = expression.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(ExpressionDeletedEvent);
      expect((events[0] as ExpressionDeletedEvent).expressionId).toBe(
        expression.getExpressionId().value,
      );
    });
  });

  describe('getExpressionId', () => {
    it('should return the expression ID', () => {
      // Arrange
      const expressionId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
      const expression = new Expression(expressionId, 'Test phrase');

      // Act
      const result = expression.getExpressionId();

      // Assert
      expect(result).toBeInstanceOf(ExpressionId);
      expect(result.value).toBe(expressionId);
    });
  });

  describe('getPhrase', () => {
    it('should return the phrase', () => {
      // Arrange
      const phrase = 'Test phrase';
      const expression = Expression.create(phrase);

      // Act
      const result = expression.getPhrase();

      // Assert
      expect(result).toBe(phrase);
    });
  });

  describe('edge cases', () => {
    it('should handle very long phrases', () => {
      // Arrange
      const longPhrase = 'a'.repeat(10000);

      // Act
      const expression = Expression.create(longPhrase);

      // Assert
      expect(expression.getPhrase()).toBe(longPhrase);
      expect(expression.getPhrase()).toHaveLength(10000);
    });

    it('should handle phrases with special characters', () => {
      // Arrange
      const specialPhrase = 'Hello 世界! @#$%^&*()_+-=[]{}|;:,.<>?';

      // Act
      const expression = Expression.create(specialPhrase);

      // Assert
      expect(expression.getPhrase()).toBe(specialPhrase);
    });

    it('should handle multiple operations and maintain event order', () => {
      // Arrange
      const expression = Expression.create('Initial phrase');
      const expressionId = expression.getExpressionId().value;

      // Act
      expression.updatePhrase('Updated phrase');
      expression.delete();

      // Assert
      const events = expression.getUncommittedEvents();
      expect(events).toHaveLength(3);

      expect(events[0]).toBeInstanceOf(ExpressionCreatedEvent);
      expect((events[0] as ExpressionCreatedEvent).expressionId).toBe(
        expressionId,
      );
      expect((events[0] as ExpressionCreatedEvent).phrase).toBe(
        'Initial phrase',
      );

      expect(events[1]).toBeInstanceOf(ExpressionPhraseUpdatedEvent);
      expect((events[1] as ExpressionPhraseUpdatedEvent).expressionId).toBe(
        expressionId,
      );
      expect((events[1] as ExpressionPhraseUpdatedEvent).oldPhrase).toBe(
        'Initial phrase',
      );
      expect((events[1] as ExpressionPhraseUpdatedEvent).newPhrase).toBe(
        'Updated phrase',
      );

      expect(events[2]).toBeInstanceOf(ExpressionDeletedEvent);
      expect((events[2] as ExpressionDeletedEvent).expressionId).toBe(
        expressionId,
      );
    });
  });
});
