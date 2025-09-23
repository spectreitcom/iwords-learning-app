import { ExpressionContext } from '../expression-context';
import { ExpressionContextId } from '../value-objects/expression-context-id';
import { ExpressionId } from '../value-objects/expression-id';
import { ExpressionType } from '../value-objects/expression-type';
import { VerbForms } from '../value-objects/verb-forms';
import { ExpressionContextCreatedEvent } from '../events/expression-context-created.event';
import { ExpressionContextDeletedEvent } from '../events/expression-context-deleted.event';
import { ExpressionContextUpdatedEvent } from '../events/expression-context-updated.event';

describe('ExpressionContext', () => {
  const mockExpressionId = '550e8400-e29b-41d4-a716-446655440000';
  const mockTranslation = 'test translation';

  describe('constructor', () => {
    it('should create ExpressionContext with all properties', () => {
      const expressionContextId = ExpressionContextId.create();
      const expressionId = ExpressionId.fromString(mockExpressionId);
      const type = ExpressionType.verb();
      const forms = VerbForms.fromArray(['go', 'went', 'gone']);

      const context = new ExpressionContext(
        expressionContextId,
        expressionId,
        mockTranslation,
        true,
        type,
        forms,
        true,
      );

      expect(context.getExpressionContextId()).toBe(expressionContextId);
      expect(context.getExpressionId()).toBe(expressionId);
      expect(context.getTranslation()).toBe(mockTranslation);
      expect(context.getIsCountable()).toBe(true);
      expect(context.getType()).toBe(type);
      expect(context.getForms()).toBe(forms);
      expect(context.getIsIrregular()).toBe(true);
    });

    it('should create ExpressionContext with null forms', () => {
      const expressionContextId = ExpressionContextId.create();
      const expressionId = ExpressionId.fromString(mockExpressionId);
      const type = ExpressionType.noun();

      const context = new ExpressionContext(
        expressionContextId,
        expressionId,
        mockTranslation,
        false,
        type,
        null,
        false,
      );

      expect(context.getForms()).toBeNull();
      expect(context.getIsIrregular()).toBe(false);
    });
  });

  describe('createVerb', () => {
    it('should create a verb ExpressionContext and apply creation event', () => {
      const context = ExpressionContext.createVerb(
        mockTranslation,
        mockExpressionId,
      );

      expect(context.getTranslation()).toBe(mockTranslation);
      expect(context.getExpressionId().value).toBe(mockExpressionId);
      expect(context.getType().value).toBe('verb');
      expect(context.getIsCountable()).toBe(false);
      expect(context.getForms()).toBeNull();
      expect(context.getIsIrregular()).toBe(false);

      const events = context.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(ExpressionContextCreatedEvent);
      const event = events[0] as ExpressionContextCreatedEvent;
      expect(event.expressionId).toBe(mockExpressionId);
      expect(event.translation).toBe(mockTranslation);
      expect(event.type).toBe('verb');
      expect(event.isCountable).toBe(false);
      expect(event.forms).toBeNull();
      expect(event.isIrregular).toBe(false);
    });
  });

  describe('createIrregularVerb', () => {
    it('should create an irregular verb ExpressionContext with forms and apply creation event', () => {
      const forms: [string, string, string] = ['go', 'went', 'gone'];
      const context = ExpressionContext.createIrregularVerb(
        mockTranslation,
        forms,
        mockExpressionId,
      );

      expect(context.getTranslation()).toBe(mockTranslation);
      expect(context.getExpressionId().value).toBe(mockExpressionId);
      expect(context.getType().value).toBe('verb');
      expect(context.getIsCountable()).toBe(false);
      expect(context.getForms()).not.toBeNull();
      expect(context.getForms()?.value).toEqual(forms);
      expect(context.getIsIrregular()).toBe(true);

      const events = context.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(ExpressionContextCreatedEvent);
      const event = events[0] as ExpressionContextCreatedEvent;
      expect(event.expressionId).toBe(mockExpressionId);
      expect(event.translation).toBe(mockTranslation);
      expect(event.type).toBe('verb');
      expect(event.isCountable).toBe(false);
      expect(event.forms).toEqual(forms);
      expect(event.isIrregular).toBe(true);
    });
  });

  describe('createAdverb', () => {
    it('should create an adverb ExpressionContext and apply creation event', () => {
      const context = ExpressionContext.createAdverb(
        mockTranslation,
        mockExpressionId,
      );

      expect(context.getTranslation()).toBe(mockTranslation);
      expect(context.getExpressionId().value).toBe(mockExpressionId);
      expect(context.getType().value).toBe('adverb');
      expect(context.getIsCountable()).toBe(false);
      expect(context.getForms()).toBeNull();
      expect(context.getIsIrregular()).toBe(false);

      const events = context.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(ExpressionContextCreatedEvent);
      const event = events[0] as ExpressionContextCreatedEvent;
      expect(event.type).toBe('adverb');
    });
  });

  describe('createAdjective', () => {
    it('should create an adjective ExpressionContext and apply creation event', () => {
      const context = ExpressionContext.createAdjective(
        mockTranslation,
        mockExpressionId,
      );

      expect(context.getTranslation()).toBe(mockTranslation);
      expect(context.getExpressionId().value).toBe(mockExpressionId);
      expect(context.getType().value).toBe('adjective');
      expect(context.getIsCountable()).toBe(false);
      expect(context.getForms()).toBeNull();
      expect(context.getIsIrregular()).toBe(false);

      const events = context.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(ExpressionContextCreatedEvent);
      const event = events[0] as ExpressionContextCreatedEvent;
      expect(event.type).toBe('adjective');
    });
  });

  describe('createNoun', () => {
    it('should create a countable noun ExpressionContext and apply creation event', () => {
      const context = ExpressionContext.createNoun(
        mockTranslation,
        mockExpressionId,
        true,
      );

      expect(context.getTranslation()).toBe(mockTranslation);
      expect(context.getExpressionId().value).toBe(mockExpressionId);
      expect(context.getType().value).toBe('noun');
      expect(context.getIsCountable()).toBe(true);
      expect(context.getForms()).toBeNull();
      expect(context.getIsIrregular()).toBe(false);

      const events = context.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(ExpressionContextCreatedEvent);
      const event = events[0] as ExpressionContextCreatedEvent;
      expect(event.type).toBe('noun');
      expect(event.isCountable).toBe(false);
    });

    it('should create a non-countable noun ExpressionContext', () => {
      const context = ExpressionContext.createNoun(
        mockTranslation,
        mockExpressionId,
        false,
      );

      expect(context.getIsCountable()).toBe(false);

      const events = context.getUncommittedEvents();
      const event = events[0] as ExpressionContextCreatedEvent;
      expect(event.isCountable).toBe(false);
    });
  });

  describe('createPhrasalVerb', () => {
    it('should create a phrasal verb ExpressionContext and apply creation event', () => {
      const context = ExpressionContext.createPhrasalVerb(
        mockTranslation,
        mockExpressionId,
      );

      expect(context.getTranslation()).toBe(mockTranslation);
      expect(context.getExpressionId().value).toBe(mockExpressionId);
      expect(context.getType().value).toBe('phrasal_verb');
      expect(context.getIsCountable()).toBe(false);
      expect(context.getForms()).toBeNull();
      expect(context.getIsIrregular()).toBe(false);

      const events = context.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(ExpressionContextCreatedEvent);
      const event = events[0] as ExpressionContextCreatedEvent;
      expect(event.type).toBe('phrasal_verb');
    });
  });

  describe('delete', () => {
    it('should apply deletion event', () => {
      const context = ExpressionContext.createVerb(
        mockTranslation,
        mockExpressionId,
      );
      // Clear creation event by creating a fresh context
      const freshContext = new ExpressionContext(
        context.getExpressionContextId(),
        context.getExpressionId(),
        context.getTranslation(),
        context.getIsCountable(),
        context.getType(),
        context.getForms(),
        context.getIsIrregular(),
      );

      freshContext.delete();

      const events = freshContext.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(ExpressionContextDeletedEvent);
      const event = events[0] as ExpressionContextDeletedEvent;
      expect(event.expressionContextId).toBe(
        context.getExpressionContextId().value,
      );
    });
  });

  describe('updateVerb', () => {
    it('should update verb translation and apply update event', () => {
      const context = ExpressionContext.createVerb(
        mockTranslation,
        mockExpressionId,
      );
      // Clear creation event by creating a fresh context
      const freshContext = new ExpressionContext(
        context.getExpressionContextId(),
        context.getExpressionId(),
        context.getTranslation(),
        context.getIsCountable(),
        context.getType(),
        context.getForms(),
        context.getIsIrregular(),
      );

      const newTranslation = 'updated translation';
      freshContext.updateVerb(newTranslation);

      expect(freshContext.getTranslation()).toBe(newTranslation);

      const events = freshContext.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(ExpressionContextUpdatedEvent);
      const event = events[0] as ExpressionContextUpdatedEvent;
      expect(event.translation).toBe(newTranslation);
      expect(event.type).toBe('verb');
      expect(event.forms).toBeNull();
      expect(event.isIrregular).toBe(false);
    });
  });

  describe('updateIrregularVerb', () => {
    it('should update irregular verb translation and forms and apply update event', () => {
      const initialForms: [string, string, string] = ['go', 'went', 'gone'];
      const context = ExpressionContext.createIrregularVerb(
        mockTranslation,
        initialForms,
        mockExpressionId,
      );
      // Clear creation event by creating a fresh context
      const freshContext = new ExpressionContext(
        context.getExpressionContextId(),
        context.getExpressionId(),
        context.getTranslation(),
        context.getIsCountable(),
        context.getType(),
        context.getForms(),
        context.getIsIrregular(),
      );

      const newTranslation = 'updated translation';
      const newForms: [string, string, string] = ['run', 'ran', 'run'];
      freshContext.updateIrregularVerb(newTranslation, newForms);

      expect(freshContext.getTranslation()).toBe(newTranslation);
      expect(freshContext.getForms()?.value).toEqual(newForms);

      const events = freshContext.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(ExpressionContextUpdatedEvent);
      const event = events[0] as ExpressionContextUpdatedEvent;
      expect(event.translation).toBe(newTranslation);
      expect(event.forms).toEqual(newForms);
      expect(event.isIrregular).toBe(true);
    });
  });

  describe('updateAdverb', () => {
    it('should update adverb translation and apply update event', () => {
      const context = ExpressionContext.createAdverb(
        mockTranslation,
        mockExpressionId,
      );
      // Clear creation event by creating a fresh context
      const freshContext = new ExpressionContext(
        context.getExpressionContextId(),
        context.getExpressionId(),
        context.getTranslation(),
        context.getIsCountable(),
        context.getType(),
        context.getForms(),
        context.getIsIrregular(),
      );

      const newTranslation = 'updated adverb translation';
      freshContext.updateAdverb(newTranslation);

      expect(freshContext.getTranslation()).toBe(newTranslation);

      const events = freshContext.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(ExpressionContextUpdatedEvent);
      const event = events[0] as ExpressionContextUpdatedEvent;
      expect(event.translation).toBe(newTranslation);
      expect(event.type).toBe('adverb');
    });
  });

  describe('updateAdjective', () => {
    it('should update adjective translation and apply update event', () => {
      const context = ExpressionContext.createAdjective(
        mockTranslation,
        mockExpressionId,
      );
      // Clear creation event by creating a fresh context
      const freshContext = new ExpressionContext(
        context.getExpressionContextId(),
        context.getExpressionId(),
        context.getTranslation(),
        context.getIsCountable(),
        context.getType(),
        context.getForms(),
        context.getIsIrregular(),
      );

      const newTranslation = 'updated adjective translation';
      freshContext.updateAdjective(newTranslation);

      expect(freshContext.getTranslation()).toBe(newTranslation);

      const events = freshContext.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(ExpressionContextUpdatedEvent);
      const event = events[0] as ExpressionContextUpdatedEvent;
      expect(event.translation).toBe(newTranslation);
      expect(event.type).toBe('adjective');
    });
  });

  describe('updateNoun', () => {
    it('should update noun translation and countability and apply update event', () => {
      const context = ExpressionContext.createNoun(
        mockTranslation,
        mockExpressionId,
        false,
      );
      // Clear creation event by creating a fresh context
      const freshContext = new ExpressionContext(
        context.getExpressionContextId(),
        context.getExpressionId(),
        context.getTranslation(),
        context.getIsCountable(),
        context.getType(),
        context.getForms(),
        context.getIsIrregular(),
      );

      const newTranslation = 'updated noun translation';
      freshContext.updateNoun(newTranslation, true);

      expect(freshContext.getTranslation()).toBe(newTranslation);
      expect(freshContext.getIsCountable()).toBe(true);

      const events = freshContext.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(ExpressionContextUpdatedEvent);
      const event = events[0] as ExpressionContextUpdatedEvent;
      expect(event.translation).toBe(newTranslation);
      expect(event.isCountable).toBe(true);
      expect(event.type).toBe('noun');
    });
  });

  describe('updatePhrasalVerb', () => {
    it('should update phrasal verb translation and apply update event', () => {
      const context = ExpressionContext.createPhrasalVerb(
        mockTranslation,
        mockExpressionId,
      );
      // Clear creation event by creating a fresh context
      const freshContext = new ExpressionContext(
        context.getExpressionContextId(),
        context.getExpressionId(),
        context.getTranslation(),
        context.getIsCountable(),
        context.getType(),
        context.getForms(),
        context.getIsIrregular(),
      );

      const newTranslation = 'updated phrasal verb translation';
      freshContext.updatePhrasalVerb(newTranslation);

      expect(freshContext.getTranslation()).toBe(newTranslation);

      const events = freshContext.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(ExpressionContextUpdatedEvent);
      const event = events[0] as ExpressionContextUpdatedEvent;
      expect(event.translation).toBe(newTranslation);
      expect(event.type).toBe('phrasal_verb');
    });
  });

  describe('getter methods', () => {
    let context: ExpressionContext;
    let expressionContextId: ExpressionContextId;
    let expressionId: ExpressionId;
    let type: ExpressionType;
    let forms: VerbForms;

    beforeEach(() => {
      expressionContextId = ExpressionContextId.create();
      expressionId = ExpressionId.fromString(mockExpressionId);
      type = ExpressionType.verb();
      forms = VerbForms.fromArray(['test', 'tested', 'tested']);

      context = new ExpressionContext(
        expressionContextId,
        expressionId,
        mockTranslation,
        true,
        type,
        forms,
        true,
      );
    });

    it('should return correct expression context id', () => {
      expect(context.getExpressionContextId()).toBe(expressionContextId);
    });

    it('should return correct expression id', () => {
      expect(context.getExpressionId()).toBe(expressionId);
    });

    it('should return correct translation', () => {
      expect(context.getTranslation()).toBe(mockTranslation);
    });

    it('should return correct countable flag', () => {
      expect(context.getIsCountable()).toBe(true);
    });

    it('should return correct type', () => {
      expect(context.getType()).toBe(type);
    });

    it('should return correct forms', () => {
      expect(context.getForms()).toBe(forms);
    });

    it('should return correct irregular flag', () => {
      expect(context.getIsIrregular()).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle empty translation string', () => {
      const context = ExpressionContext.createVerb('', mockExpressionId);
      expect(context.getTranslation()).toBe('');
    });

    it('should handle forms set in constructor', () => {
      const expressionContextId = ExpressionContextId.create();
      const expressionId = ExpressionId.fromString(mockExpressionId);
      const type = ExpressionType.verb();
      const forms = VerbForms.fromArray(['test', 'tested', 'tested']);

      const context = new ExpressionContext(
        expressionContextId,
        expressionId,
        mockTranslation,
        false,
        type,
        forms,
        false,
      );

      expect(context.getForms()).toBe(forms);
    });

    it('should handle null forms passed to constructor', () => {
      const expressionContextId = ExpressionContextId.create();
      const expressionId = ExpressionId.fromString(mockExpressionId);
      const type = ExpressionType.noun();

      const context = new ExpressionContext(
        expressionContextId,
        expressionId,
        mockTranslation,
        false,
        type,
        null,
        false,
      );

      expect(context.getForms()).toBeNull();
    });
  });
});
