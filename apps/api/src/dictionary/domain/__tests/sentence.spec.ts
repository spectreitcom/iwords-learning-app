import { Sentence } from '../sentence';
import { SentenceId } from '../value-objects/sentence-id';
import { ExpressionContextId } from '../value-objects/expression-context-id';
import { SentenceCreatedEvent } from '../events/sentence-created.event';
import { SentenceDeletedEvent } from '../events/sentence-deleted.event';

describe('Sentence', () => {
  const mockContent = 'This is a test sentence';
  const mockTranslation = 'To jest testowe zdanie';
  const mockExpressionContextId = '550e8400-e29b-41d4-a716-446655440000';

  describe('constructor', () => {
    it('should create a sentence with valid parameters', () => {
      // Arrange
      const sentenceId = SentenceId.create();
      const expressionContextId = ExpressionContextId.fromString(
        mockExpressionContextId,
      );

      // Act
      const sentence = new Sentence(
        sentenceId,
        mockContent,
        mockTranslation,
        expressionContextId,
      );

      // Assert
      expect(sentence.getSentenceId()).toBe(sentenceId);
      expect(sentence.getContent()).toBe(mockContent);
      expect(sentence.getTranslation()).toBe(mockTranslation);
      expect(sentence.getExpressionContextId()).toBe(expressionContextId);
    });
  });

  describe('create', () => {
    it('should create a new sentence instance with generated ID', () => {
      // Act
      const sentence = Sentence.create(
        mockContent,
        mockTranslation,
        mockExpressionContextId,
      );

      // Assert
      expect(sentence).toBeInstanceOf(Sentence);
      expect(sentence.getSentenceId()).toBeInstanceOf(SentenceId);
      expect(sentence.getContent()).toBe(mockContent);
      expect(sentence.getTranslation()).toBe(mockTranslation);
      expect(sentence.getExpressionContextId().value).toBe(
        mockExpressionContextId,
      );
    });

    it('should emit SentenceCreatedEvent when created', () => {
      // Arrange
      const sentence = Sentence.create(
        mockContent,
        mockTranslation,
        mockExpressionContextId,
      );

      // Act
      const events = sentence.getUncommittedEvents();

      // Assert
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(SentenceCreatedEvent);

      const event = events[0] as SentenceCreatedEvent;
      expect(event.sentenceId).toBe(sentence.getSentenceId().value);
      expect(event['content']).toBe(mockContent);
      expect(event['translation']).toBe(mockTranslation);
      expect(event['expressionContextId']).toBe(mockExpressionContextId);
    });

    it('should create different sentences with unique IDs', () => {
      // Act
      const sentence1 = Sentence.create(
        mockContent,
        mockTranslation,
        mockExpressionContextId,
      );
      const sentence2 = Sentence.create(
        mockContent,
        mockTranslation,
        mockExpressionContextId,
      );

      // Assert
      expect(sentence1.getSentenceId().value).not.toBe(
        sentence2.getSentenceId().value,
      );
    });
  });

  describe('getSentenceId', () => {
    it('should return the sentence ID', () => {
      // Arrange
      const sentenceId = SentenceId.create();
      const expressionContextId = ExpressionContextId.fromString(
        mockExpressionContextId,
      );
      const sentence = new Sentence(
        sentenceId,
        mockContent,
        mockTranslation,
        expressionContextId,
      );

      // Act
      const result = sentence.getSentenceId();

      // Assert
      expect(result).toBe(sentenceId);
      expect(result).toBeInstanceOf(SentenceId);
    });
  });

  describe('getContent', () => {
    it('should return the sentence content', () => {
      // Arrange
      const sentence = Sentence.create(
        mockContent,
        mockTranslation,
        mockExpressionContextId,
      );

      // Act
      const result = sentence.getContent();

      // Assert
      expect(result).toBe(mockContent);
    });

    it('should return correct content for different sentences', () => {
      // Arrange
      const content1 = 'First sentence';
      const content2 = 'Second sentence';
      const sentence1 = Sentence.create(
        content1,
        mockTranslation,
        mockExpressionContextId,
      );
      const sentence2 = Sentence.create(
        content2,
        mockTranslation,
        mockExpressionContextId,
      );

      // Act & Assert
      expect(sentence1.getContent()).toBe(content1);
      expect(sentence2.getContent()).toBe(content2);
    });
  });

  describe('getTranslation', () => {
    it('should return the sentence translation', () => {
      // Arrange
      const sentence = Sentence.create(
        mockContent,
        mockTranslation,
        mockExpressionContextId,
      );

      // Act
      const result = sentence.getTranslation();

      // Assert
      expect(result).toBe(mockTranslation);
    });

    it('should return correct translation for different sentences', () => {
      // Arrange
      const translation1 = 'Pierwsze zdanie';
      const translation2 = 'Drugie zdanie';
      const sentence1 = Sentence.create(
        mockContent,
        translation1,
        mockExpressionContextId,
      );
      const sentence2 = Sentence.create(
        mockContent,
        translation2,
        mockExpressionContextId,
      );

      // Act & Assert
      expect(sentence1.getTranslation()).toBe(translation1);
      expect(sentence2.getTranslation()).toBe(translation2);
    });
  });

  describe('getExpressionContextId', () => {
    it('should return the expression context ID', () => {
      // Arrange
      const sentence = Sentence.create(
        mockContent,
        mockTranslation,
        mockExpressionContextId,
      );

      // Act
      const result = sentence.getExpressionContextId();

      // Assert
      expect(result).toBeInstanceOf(ExpressionContextId);
      expect(result.value).toBe(mockExpressionContextId);
    });

    it('should return correct expression context ID for different sentences', () => {
      // Arrange
      const contextId1 = '550e8400-e29b-41d4-a716-446655440001';
      const contextId2 = '550e8400-e29b-41d4-a716-446655440002';
      const sentence1 = Sentence.create(
        mockContent,
        mockTranslation,
        contextId1,
      );
      const sentence2 = Sentence.create(
        mockContent,
        mockTranslation,
        contextId2,
      );

      // Act & Assert
      expect(sentence1.getExpressionContextId().value).toBe(contextId1);
      expect(sentence2.getExpressionContextId().value).toBe(contextId2);
    });
  });

  describe('delete', () => {
    it('should emit SentenceDeletedEvent when deleted', () => {
      // Arrange
      const sentence = Sentence.create(
        mockContent,
        mockTranslation,
        mockExpressionContextId,
      );

      // Act
      sentence.delete();

      // Assert
      const events = sentence.getUncommittedEvents();
      expect(events).toHaveLength(2); // Created + Deleted
      expect(events[0]).toBeInstanceOf(SentenceCreatedEvent);
      expect(events[1]).toBeInstanceOf(SentenceDeletedEvent);

      const deleteEvent = events[1] as SentenceDeletedEvent;
      expect(deleteEvent.sentenceId).toBe(sentence.getSentenceId().value);
    });

    it('should emit SentenceDeletedEvent with correct sentence ID', () => {
      // Arrange
      const sentenceId = SentenceId.create();
      const expressionContextId = ExpressionContextId.fromString(
        mockExpressionContextId,
      );
      const sentence = new Sentence(
        sentenceId,
        mockContent,
        mockTranslation,
        expressionContextId,
      );

      // Act
      sentence.delete();

      // Assert
      const events = sentence.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(SentenceDeletedEvent);

      const deleteEvent = events[0] as SentenceDeletedEvent;
      expect(deleteEvent.sentenceId).toBe(sentenceId.value);
    });

    it('should emit multiple events when delete is called multiple times', () => {
      // Arrange
      const sentence = Sentence.create(
        mockContent,
        mockTranslation,
        mockExpressionContextId,
      );

      // Act
      sentence.delete();
      sentence.delete();

      // Assert
      const events = sentence.getUncommittedEvents();
      expect(events).toHaveLength(3); // Created + Deleted + Deleted
      expect(events[0]).toBeInstanceOf(SentenceCreatedEvent);
      expect(events[1]).toBeInstanceOf(SentenceDeletedEvent);
      expect(events[2]).toBeInstanceOf(SentenceDeletedEvent);

      const deleteEvent1 = events[1] as SentenceDeletedEvent;
      const deleteEvent2 = events[2] as SentenceDeletedEvent;
      expect(deleteEvent1.sentenceId).toBe(sentence.getSentenceId().value);
      expect(deleteEvent2.sentenceId).toBe(sentence.getSentenceId().value);
    });
  });

  describe('edge cases', () => {
    it('should handle empty content', () => {
      // Act
      const sentence = Sentence.create(
        '',
        mockTranslation,
        mockExpressionContextId,
      );

      // Assert
      expect(sentence.getContent()).toBe('');
    });

    it('should handle empty translation', () => {
      // Act
      const sentence = Sentence.create(
        mockContent,
        '',
        mockExpressionContextId,
      );

      // Assert
      expect(sentence.getTranslation()).toBe('');
    });

    it('should handle very long content', () => {
      // Arrange
      const longContent = 'a'.repeat(1000);

      // Act
      const sentence = Sentence.create(
        longContent,
        mockTranslation,
        mockExpressionContextId,
      );

      // Assert
      expect(sentence.getContent()).toBe(longContent);
    });

    it('should handle special characters in content and translation', () => {
      // Arrange
      const specialContent =
        'Content with special chars: àáâãäåæçèéêë 123 !@#$%';
      const specialTranslation =
        'Treść ze znakami specjalnymi: ąćęłńóśźż 123 !@#$%';

      // Act
      const sentence = Sentence.create(
        specialContent,
        specialTranslation,
        mockExpressionContextId,
      );

      // Assert
      expect(sentence.getContent()).toBe(specialContent);
      expect(sentence.getTranslation()).toBe(specialTranslation);
    });
  });

  describe('inheritance from AggregateRoot', () => {
    it('should extend AggregateRoot and have event handling capabilities', () => {
      // Arrange
      const sentence = Sentence.create(
        mockContent,
        mockTranslation,
        mockExpressionContextId,
      );

      // Assert
      expect(typeof sentence.getUncommittedEvents).toBe('function');
      expect(typeof sentence.apply).toBe('function');
    });

    it('should have uncommitted events after creation', () => {
      // Arrange
      const sentence = Sentence.create(
        mockContent,
        mockTranslation,
        mockExpressionContextId,
      );

      // Act
      const events = sentence.getUncommittedEvents();

      // Assert
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(SentenceCreatedEvent);
    });
  });
});
