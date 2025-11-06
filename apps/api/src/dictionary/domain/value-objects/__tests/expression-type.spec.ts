import { ExpressionType } from '../expression-type';
import {
  VERB,
  NOUN,
  ADJECTIVE,
  ADVERB,
  PHRASAL_VERB,
  IRREGULAR_VERB,
  SIMPLE_EXPRESSION,
} from '../../constants';

describe('ExpressionType', () => {
  describe('static factory methods', () => {
    it('should create verb expression type', () => {
      const expressionType = ExpressionType.verb();
      expect(expressionType.value).toBe(VERB);
    });

    it('should create noun expression type', () => {
      const expressionType = ExpressionType.noun();
      expect(expressionType.value).toBe(NOUN);
    });

    it('should create adjective expression type', () => {
      const expressionType = ExpressionType.adjective();
      expect(expressionType.value).toBe(ADJECTIVE);
    });

    it('should create adverb expression type', () => {
      const expressionType = ExpressionType.adverb();
      expect(expressionType.value).toBe(ADVERB);
    });

    it('should create phrasal verb expression type', () => {
      const expressionType = ExpressionType.phrasalVerb();
      expect(expressionType.value).toBe(PHRASAL_VERB);
    });

    it('should create irregular verb expression type', () => {
      const expressionType = ExpressionType.irregularVerb();
      expect(expressionType.value).toBe(IRREGULAR_VERB);
    });

    it('should create simple expression type', () => {
      const expressionType = ExpressionType.simpleExpression();
      expect(expressionType.value).toBe(SIMPLE_EXPRESSION);
    });
  });

  describe('fromString', () => {
    it('should create expression type from valid string - verb', () => {
      const expressionType = ExpressionType.fromString(VERB);
      expect(expressionType.value).toBe(VERB);
    });

    it('should create expression type from valid string - noun', () => {
      const expressionType = ExpressionType.fromString(NOUN);
      expect(expressionType.value).toBe(NOUN);
    });

    it('should create expression type from valid string - adjective', () => {
      const expressionType = ExpressionType.fromString(ADJECTIVE);
      expect(expressionType.value).toBe(ADJECTIVE);
    });

    it('should create expression type from valid string - adverb', () => {
      const expressionType = ExpressionType.fromString(ADVERB);
      expect(expressionType.value).toBe(ADVERB);
    });

    it('should create expression type from valid string - phrasal verb', () => {
      const expressionType = ExpressionType.fromString(PHRASAL_VERB);
      expect(expressionType.value).toBe(PHRASAL_VERB);
    });

    it('should create expression type from valid string - irregular verb', () => {
      const expressionType = ExpressionType.fromString(IRREGULAR_VERB);
      expect(expressionType.value).toBe(IRREGULAR_VERB);
    });

    it('should throw error for invalid string', () => {
      expect(() => {
        ExpressionType.fromString('invalid');
      }).toThrow('ExpressionType is not valid');
    });

    it('should throw error for empty string', () => {
      expect(() => {
        ExpressionType.fromString('');
      }).toThrow('ExpressionType is not valid');
    });

    it('should throw error for undefined', () => {
      expect(() => {
        ExpressionType.fromString(undefined as unknown as string);
      }).toThrow('ExpressionType is not valid');
    });

    it('should throw error for null', () => {
      expect(() => {
        ExpressionType.fromString(null as unknown as string);
      }).toThrow('ExpressionType is not valid');
    });

    it('should be case sensitive', () => {
      expect(() => {
        ExpressionType.fromString('VERB');
      }).toThrow('ExpressionType is not valid');
    });
  });

  describe('equals', () => {
    it('should return true for same expression types', () => {
      const type1 = ExpressionType.verb();
      const type2 = ExpressionType.verb();
      expect(type1.equals(type2)).toBe(true);
    });

    it('should return true for expression types created differently but with same value', () => {
      const type1 = ExpressionType.verb();
      const type2 = ExpressionType.fromString(VERB);
      expect(type1.equals(type2)).toBe(true);
    });

    it('should return false for different expression types', () => {
      const type1 = ExpressionType.verb();
      const type2 = ExpressionType.noun();
      expect(type1.equals(type2)).toBe(false);
    });

    it('should return false for verb vs adjective', () => {
      const type1 = ExpressionType.verb();
      const type2 = ExpressionType.adjective();
      expect(type1.equals(type2)).toBe(false);
    });

    it('should return false for noun vs adverb', () => {
      const type1 = ExpressionType.noun();
      const type2 = ExpressionType.adverb();
      expect(type1.equals(type2)).toBe(false);
    });

    it('should return false for adjective vs phrasal verb', () => {
      const type1 = ExpressionType.adjective();
      const type2 = ExpressionType.phrasalVerb();
      expect(type1.equals(type2)).toBe(false);
    });
  });
});
