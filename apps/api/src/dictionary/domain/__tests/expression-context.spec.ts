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
    it('should create an ExpressionContext with all properties', () => {
      const expressionContextId = ExpressionContextId.create();
      const expressionId = ExpressionId.fromString(mockExpressionId);
      const type = ExpressionType.verb();
      const forms = VerbForms.fromArray(['go', 'went', 'gone']);

      const expressionContext = new ExpressionContext(
        expressionContextId,
        expressionId,
        mockTranslation,
        true,
        type,
        forms,
        true,
      );

      expect(expressionContext.getExpressionContextId()).toBe(
        expressionContextId,
      );
      expect(expressionContext.getExpressionId()).toBe(expressionId);
      expect(expressionContext.getTranslation()).toBe(mockTranslation);
      expect(expressionContext.getIsCountable()).toBe(true);
      expect(expressionContext.getType()).toBe(type);
      expect(expressionContext.getForms()).toBe(forms);
      expect(expressionContext.getIsIrregular()).toBe(true);
    });

    it('should handle null forms', () => {
      const expressionContextId = ExpressionContextId.create();
      const expressionId = ExpressionId.fromString(mockExpressionId);
      const type = ExpressionType.noun();

      const expressionContext = new ExpressionContext(
        expressionContextId,
        expressionId,
        mockTranslation,
        false,
        type,
        null,
        false,
      );

      expect(expressionContext.getForms()).toBeNull();
    });
  });

  describe('createVerb', () => {
    it('should create a verb expression context', () => {
      const expressionContext = ExpressionContext.createVerb(
        mockTranslation,
        mockExpressionId,
      );

      expect(expressionContext.getTranslation()).toBe(mockTranslation);
      expect(expressionContext.getExpressionId().value).toBe(mockExpressionId);
      expect(expressionContext.getIsCountable()).toBe(false);
      expect(expressionContext.getType().value).toBe('verb');
      expect(expressionContext.getForms()).toBeNull();
      expect(expressionContext.getIsIrregular()).toBe(false);
    });

    it('should emit ExpressionContextCreatedEvent for verb', () => {
      const expressionContext = ExpressionContext.createVerb(
        mockTranslation,
        mockExpressionId,
      );
      const events = expressionContext.getUncommittedEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(ExpressionContextCreatedEvent);

      const event = events[0] as ExpressionContextCreatedEvent;
      expect(event.expressionId).toBe(mockExpressionId);
      expect(event.translation).toBe(mockTranslation);
      expect(event.isCountable).toBe(false);
      expect(event.type).toBe('verb');
      expect(event.forms).toBeNull();
      expect(event.isIrregular).toBe(false);
    });
  });

  describe('createIrregularVerb', () => {
    const verbForms: [string, string, string] = ['go', 'went', 'gone'];

    it('should create an irregular verb expression context', () => {
      const expressionContext = ExpressionContext.createIrregularVerb(
        mockTranslation,
        verbForms,
        mockExpressionId,
      );

      expect(expressionContext.getTranslation()).toBe(mockTranslation);
      expect(expressionContext.getExpressionId().value).toBe(mockExpressionId);
      expect(expressionContext.getIsCountable()).toBe(false);
      expect(expressionContext.getType().value).toBe('irregular_verb');
      expect(expressionContext.getForms()).not.toBeNull();
      expect(expressionContext.getIsIrregular()).toBe(true);
    });

    it('should emit ExpressionContextCreatedEvent for irregular verb', () => {
      const expressionContext = ExpressionContext.createIrregularVerb(
        mockTranslation,
        verbForms,
        mockExpressionId,
      );
      const events = expressionContext.getUncommittedEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(ExpressionContextCreatedEvent);

      const event = events[0] as ExpressionContextCreatedEvent;
      expect(event.expressionId).toBe(mockExpressionId);
      expect(event.translation).toBe(mockTranslation);
      expect(event.isCountable).toBe(false);
      expect(event.type).toBe('irregular_verb');
      expect(event.forms).toEqual(verbForms);
      expect(event.isIrregular).toBe(true);
    });
  });

  describe('createAdverb', () => {
    it('should create an adverb expression context', () => {
      const expressionContext = ExpressionContext.createAdverb(
        mockTranslation,
        mockExpressionId,
      );

      expect(expressionContext.getTranslation()).toBe(mockTranslation);
      expect(expressionContext.getExpressionId().value).toBe(mockExpressionId);
      expect(expressionContext.getIsCountable()).toBe(false);
      expect(expressionContext.getType().value).toBe('adverb');
      expect(expressionContext.getForms()).toBeNull();
      expect(expressionContext.getIsIrregular()).toBe(false);
    });

    it('should emit ExpressionContextCreatedEvent for adverb', () => {
      const expressionContext = ExpressionContext.createAdverb(
        mockTranslation,
        mockExpressionId,
      );
      const events = expressionContext.getUncommittedEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(ExpressionContextCreatedEvent);

      const event = events[0] as ExpressionContextCreatedEvent;
      expect(event.type).toBe('adverb');
    });
  });

  describe('createAdjective', () => {
    it('should create an adjective expression context', () => {
      const expressionContext = ExpressionContext.createAdjective(
        mockTranslation,
        mockExpressionId,
      );

      expect(expressionContext.getTranslation()).toBe(mockTranslation);
      expect(expressionContext.getExpressionId().value).toBe(mockExpressionId);
      expect(expressionContext.getIsCountable()).toBe(false);
      expect(expressionContext.getType().value).toBe('adjective');
      expect(expressionContext.getForms()).toBeNull();
      expect(expressionContext.getIsIrregular()).toBe(false);
    });

    it('should emit ExpressionContextCreatedEvent for adjective', () => {
      const expressionContext = ExpressionContext.createAdjective(
        mockTranslation,
        mockExpressionId,
      );
      const events = expressionContext.getUncommittedEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(ExpressionContextCreatedEvent);

      const event = events[0] as ExpressionContextCreatedEvent;
      expect(event.type).toBe('adjective');
    });
  });

  describe('createNoun', () => {
    it('should create a countable noun expression context', () => {
      const expressionContext = ExpressionContext.createNoun(
        mockTranslation,
        mockExpressionId,
        true,
      );

      expect(expressionContext.getTranslation()).toBe(mockTranslation);
      expect(expressionContext.getExpressionId().value).toBe(mockExpressionId);
      expect(expressionContext.getIsCountable()).toBe(true);
      expect(expressionContext.getType().value).toBe('noun');
      expect(expressionContext.getForms()).toBeNull();
      expect(expressionContext.getIsIrregular()).toBe(false);
    });

    it('should create an uncountable noun expression context', () => {
      const expressionContext = ExpressionContext.createNoun(
        mockTranslation,
        mockExpressionId,
        false,
      );

      expect(expressionContext.getIsCountable()).toBe(false);
    });

    it('should emit ExpressionContextCreatedEvent for noun', () => {
      const expressionContext = ExpressionContext.createNoun(
        mockTranslation,
        mockExpressionId,
        true,
      );
      const events = expressionContext.getUncommittedEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(ExpressionContextCreatedEvent);

      const event = events[0] as ExpressionContextCreatedEvent;
      expect(event.type).toBe('noun');
    });
  });

  describe('createPhrasalVerb', () => {
    it('should create a phrasal verb expression context', () => {
      const expressionContext = ExpressionContext.createPhrasalVerb(
        mockTranslation,
        mockExpressionId,
      );

      expect(expressionContext.getTranslation()).toBe(mockTranslation);
      expect(expressionContext.getExpressionId().value).toBe(mockExpressionId);
      expect(expressionContext.getIsCountable()).toBe(false);
      expect(expressionContext.getType().value).toBe('phrasal_verb');
      expect(expressionContext.getForms()).toBeNull();
      expect(expressionContext.getIsIrregular()).toBe(false);
    });

    it('should emit ExpressionContextCreatedEvent for phrasal verb', () => {
      const expressionContext = ExpressionContext.createPhrasalVerb(
        mockTranslation,
        mockExpressionId,
      );
      const events = expressionContext.getUncommittedEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(ExpressionContextCreatedEvent);

      const event = events[0] as ExpressionContextCreatedEvent;
      expect(event.type).toBe('phrasal_verb');
    });
  });

  describe('crateSimpleExpression', () => {
    it('should create a simple expression context', () => {
      const expressionContext = ExpressionContext.crateSimpleExpression(
        mockTranslation,
        mockExpressionId,
      );

      expect(expressionContext.getTranslation()).toBe(mockTranslation);
      expect(expressionContext.getExpressionId().value).toBe(mockExpressionId);
      expect(expressionContext.getIsCountable()).toBe(false);
      expect(expressionContext.getType().value).toBe('simple_expression');
      expect(expressionContext.getForms()).toBeNull();
      expect(expressionContext.getIsIrregular()).toBe(false);
    });

    it('should emit ExpressionContextCreatedEvent for simple expression', () => {
      const expressionContext = ExpressionContext.crateSimpleExpression(
        mockTranslation,
        mockExpressionId,
      );
      const events = expressionContext.getUncommittedEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(ExpressionContextCreatedEvent);

      const event = events[0] as ExpressionContextCreatedEvent;
      expect(event.type).toBe('simple_expression');
    });
  });

  describe('delete', () => {
    it('should emit ExpressionContextDeletedEvent', () => {
      const expressionContext = ExpressionContext.createVerb(
        mockTranslation,
        mockExpressionId,
      );

      expressionContext.delete();

      const events = expressionContext.getUncommittedEvents();
      expect(events).toHaveLength(2); // Creation event + deletion event
      expect(events[1]).toBeInstanceOf(ExpressionContextDeletedEvent);

      const event = events[1] as ExpressionContextDeletedEvent;
      expect(event.expressionContextId).toBe(
        expressionContext.getExpressionContextId().value,
      );
      expect(event.expressionId).toBe(mockExpressionId);
    });
  });

  describe('updateVerb', () => {
    it('should update verb translation and emit event', () => {
      const expressionContext = ExpressionContext.createVerb(
        mockTranslation,
        mockExpressionId,
      );

      const newTranslation = 'updated translation';
      expressionContext.updateVerb(newTranslation);

      expect(expressionContext.getTranslation()).toBe(newTranslation);

      const events = expressionContext.getUncommittedEvents();
      expect(events).toHaveLength(2); // Creation event + update event
      expect(events[1]).toBeInstanceOf(ExpressionContextUpdatedEvent);

      const event = events[1] as ExpressionContextUpdatedEvent;
      expect(event.translation).toBe(newTranslation);
      expect(event.type).toBe('verb');
    });
  });

  describe('updateIrregularVerb', () => {
    it('should update irregular verb translation and forms', () => {
      const initialForms: [string, string, string] = ['go', 'went', 'gone'];
      const expressionContext = ExpressionContext.createIrregularVerb(
        mockTranslation,
        initialForms,
        mockExpressionId,
      );

      const newTranslation = 'updated translation';
      const newForms: [string, string, string] = ['run', 'ran', 'run'];
      expressionContext.updateIrregularVerb(newTranslation, newForms);

      expect(expressionContext.getTranslation()).toBe(newTranslation);
      expect(expressionContext.getForms()?.value).toEqual(newForms);

      const events = expressionContext.getUncommittedEvents();
      expect(events).toHaveLength(2); // Creation event + update event
      expect(events[1]).toBeInstanceOf(ExpressionContextUpdatedEvent);

      const event = events[1] as ExpressionContextUpdatedEvent;
      expect(event.translation).toBe(newTranslation);
      expect(event.forms).toEqual(newForms);
    });
  });

  describe('updateAdverb', () => {
    it('should update adverb translation and emit event', () => {
      const expressionContext = ExpressionContext.createAdverb(
        mockTranslation,
        mockExpressionId,
      );

      const newTranslation = 'updated translation';
      expressionContext.updateAdverb(newTranslation);

      expect(expressionContext.getTranslation()).toBe(newTranslation);

      const events = expressionContext.getUncommittedEvents();
      expect(events).toHaveLength(2); // Creation event + update event
      expect(events[1]).toBeInstanceOf(ExpressionContextUpdatedEvent);

      const event = events[1] as ExpressionContextUpdatedEvent;
      expect(event.translation).toBe(newTranslation);
      expect(event.type).toBe('adverb');
    });
  });

  describe('updateAdjective', () => {
    it('should update adjective translation and emit event', () => {
      const expressionContext = ExpressionContext.createAdjective(
        mockTranslation,
        mockExpressionId,
      );

      const newTranslation = 'updated translation';
      expressionContext.updateAdjective(newTranslation);

      expect(expressionContext.getTranslation()).toBe(newTranslation);

      const events = expressionContext.getUncommittedEvents();
      expect(events).toHaveLength(2); // Creation event + update event
      expect(events[1]).toBeInstanceOf(ExpressionContextUpdatedEvent);

      const event = events[1] as ExpressionContextUpdatedEvent;
      expect(event.translation).toBe(newTranslation);
      expect(event.type).toBe('adjective');
    });
  });

  describe('updateNoun', () => {
    it('should update noun translation and countability', () => {
      const expressionContext = ExpressionContext.createNoun(
        mockTranslation,
        mockExpressionId,
        false,
      );

      const newTranslation = 'updated translation';
      expressionContext.updateNoun(newTranslation, true);

      expect(expressionContext.getTranslation()).toBe(newTranslation);
      expect(expressionContext.getIsCountable()).toBe(true);

      const events = expressionContext.getUncommittedEvents();
      expect(events).toHaveLength(2); // Creation event + update event
      expect(events[1]).toBeInstanceOf(ExpressionContextUpdatedEvent);

      const event = events[1] as ExpressionContextUpdatedEvent;
      expect(event.translation).toBe(newTranslation);
      expect(event.isCountable).toBe(true);
      expect(event.type).toBe('noun');
    });
  });

  describe('updatePhrasalVerb', () => {
    it('should update phrasal verb translation and emit event', () => {
      const expressionContext = ExpressionContext.createPhrasalVerb(
        mockTranslation,
        mockExpressionId,
      );

      const newTranslation = 'updated translation';
      expressionContext.updatePhrasalVerb(newTranslation);

      expect(expressionContext.getTranslation()).toBe(newTranslation);

      const events = expressionContext.getUncommittedEvents();
      expect(events).toHaveLength(2); // Creation event + update event
      expect(events[1]).toBeInstanceOf(ExpressionContextUpdatedEvent);

      const event = events[1] as ExpressionContextUpdatedEvent;
      expect(event.translation).toBe(newTranslation);
      expect(event.type).toBe('phrasal_verb');
    });
  });

  describe('updateSimpleExpression', () => {
    it('should update simple expression translation and emit event', () => {
      const expressionContext = ExpressionContext.crateSimpleExpression(
        mockTranslation,
        mockExpressionId,
      );

      const newTranslation = 'updated translation';
      expressionContext.updateSimpleExpression(newTranslation);

      expect(expressionContext.getTranslation()).toBe(newTranslation);

      const events = expressionContext.getUncommittedEvents();
      expect(events).toHaveLength(2); // Creation event + update event
      expect(events[1]).toBeInstanceOf(ExpressionContextUpdatedEvent);

      const event = events[1] as ExpressionContextUpdatedEvent;
      expect(event.translation).toBe(newTranslation);
      expect(event.type).toBe('simple_expression');
    });
  });

  describe('getters', () => {
    it('should return all properties correctly', () => {
      const expressionContext = ExpressionContext.createNoun(
        mockTranslation,
        mockExpressionId,
        true,
      );

      expect(expressionContext.getExpressionContextId()).toBeDefined();
      expect(expressionContext.getExpressionId().value).toBe(mockExpressionId);
      expect(expressionContext.getTranslation()).toBe(mockTranslation);
      expect(expressionContext.getIsCountable()).toBe(true);
      expect(expressionContext.getType().value).toBe('noun');
      expect(expressionContext.getForms()).toBeNull();
      expect(expressionContext.getIsIrregular()).toBe(false);
    });
  });
});
