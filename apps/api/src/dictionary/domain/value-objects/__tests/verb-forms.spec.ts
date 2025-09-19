import { VerbForms } from '../verb-forms';

describe('VerbForms', () => {
  describe('fromArray', () => {
    it('should create VerbForms from valid array with 3 elements', () => {
      const validArray: [string, string, string] = ['go', 'went', 'gone'];
      const verbForms = VerbForms.fromArray(validArray);
      
      expect(verbForms.value).toEqual(['go', 'went', 'gone']);
      expect(verbForms.value[0]).toBe('go');
      expect(verbForms.value[1]).toBe('went');
      expect(verbForms.value[2]).toBe('gone');
    });

    it('should create VerbForms with empty strings', () => {
      const arrayWithEmptyStrings: [string, string, string] = ['', '', ''];
      const verbForms = VerbForms.fromArray(arrayWithEmptyStrings);
      
      expect(verbForms.value).toEqual(['', '', '']);
    });

    it('should create VerbForms with mixed content', () => {
      const mixedArray: [string, string, string] = ['run', '', 'run'];
      const verbForms = VerbForms.fromArray(mixedArray);
      
      expect(verbForms.value).toEqual(['run', '', 'run']);
    });

    it('should handle verb forms with spaces and special characters', () => {
      const specialArray: [string, string, string] = ['give up', 'gave up', 'given up'];
      const verbForms = VerbForms.fromArray(specialArray);
      
      expect(verbForms.value).toEqual(['give up', 'gave up', 'given up']);
    });
  });

  describe('validation', () => {
    it('should throw error when array has less than 3 elements', () => {
      expect(() => {
        VerbForms.fromArray(['go', 'went'] as any);
      }).toThrow('VerbForms must have 3 elements');
    });

    it('should throw error when array has more than 3 elements', () => {
      expect(() => {
        VerbForms.fromArray(['go', 'went', 'gone', 'going'] as any);
      }).toThrow('VerbForms must have 3 elements');
    });

    it('should throw error when array is empty', () => {
      expect(() => {
        VerbForms.fromArray([] as any);
      }).toThrow('VerbForms must have 3 elements');
    });

    it('should throw error when array has only 1 element', () => {
      expect(() => {
        VerbForms.fromArray(['go'] as any);
      }).toThrow('VerbForms must have 3 elements');
    });

    it('should throw error when array has only 2 elements', () => {
      expect(() => {
        VerbForms.fromArray(['go', 'went'] as any);
      }).toThrow('VerbForms must have 3 elements');
    });
  });

  describe('equals', () => {
    it('should return true for identical verb forms', () => {
      const verbForms1 = VerbForms.fromArray(['go', 'went', 'gone']);
      const verbForms2 = VerbForms.fromArray(['go', 'went', 'gone']);
      
      expect(verbForms1.equals(verbForms2)).toBe(true);
    });

    it('should return true for verb forms with same values created separately', () => {
      const array: [string, string, string] = ['run', 'ran', 'run'];
      const verbForms1 = VerbForms.fromArray(array);
      const verbForms2 = VerbForms.fromArray(['run', 'ran', 'run']);
      
      expect(verbForms1.equals(verbForms2)).toBe(true);
    });

    it('should return false for different first forms', () => {
      const verbForms1 = VerbForms.fromArray(['go', 'went', 'gone']);
      const verbForms2 = VerbForms.fromArray(['come', 'went', 'gone']);
      
      expect(verbForms1.equals(verbForms2)).toBe(false);
    });

    it('should return false for different second forms', () => {
      const verbForms1 = VerbForms.fromArray(['go', 'went', 'gone']);
      const verbForms2 = VerbForms.fromArray(['go', 'came', 'gone']);
      
      expect(verbForms1.equals(verbForms2)).toBe(false);
    });

    it('should return false for different third forms', () => {
      const verbForms1 = VerbForms.fromArray(['go', 'went', 'gone']);
      const verbForms2 = VerbForms.fromArray(['go', 'went', 'come']);
      
      expect(verbForms1.equals(verbForms2)).toBe(false);
    });

    it('should return false when all forms are different', () => {
      const verbForms1 = VerbForms.fromArray(['go', 'went', 'gone']);
      const verbForms2 = VerbForms.fromArray(['run', 'ran', 'run']);
      
      expect(verbForms1.equals(verbForms2)).toBe(false);
    });

    it('should return true for empty string forms', () => {
      const verbForms1 = VerbForms.fromArray(['', '', '']);
      const verbForms2 = VerbForms.fromArray(['', '', '']);
      
      expect(verbForms1.equals(verbForms2)).toBe(true);
    });

    it('should return false when comparing empty vs non-empty forms', () => {
      const verbForms1 = VerbForms.fromArray(['', '', '']);
      const verbForms2 = VerbForms.fromArray(['go', 'went', 'gone']);
      
      expect(verbForms1.equals(verbForms2)).toBe(false);
    });

    it('should be case sensitive', () => {
      const verbForms1 = VerbForms.fromArray(['Go', 'Went', 'Gone']);
      const verbForms2 = VerbForms.fromArray(['go', 'went', 'gone']);
      
      expect(verbForms1.equals(verbForms2)).toBe(false);
    });

    it('should handle phrasal verbs correctly', () => {
      const verbForms1 = VerbForms.fromArray(['give up', 'gave up', 'given up']);
      const verbForms2 = VerbForms.fromArray(['give up', 'gave up', 'given up']);
      
      expect(verbForms1.equals(verbForms2)).toBe(true);
    });
  });

  describe('value property', () => {
    it('should be readonly and return the correct tuple', () => {
      const inputArray: [string, string, string] = ['eat', 'ate', 'eaten'];
      const verbForms = VerbForms.fromArray(inputArray);
      
      expect(verbForms.value).toEqual(inputArray);
      expect(verbForms.value).toHaveLength(3);
    });

    it('should maintain reference integrity', () => {
      const verbForms = VerbForms.fromArray(['write', 'wrote', 'written']);
      const value1 = verbForms.value;
      const value2 = verbForms.value;
      
      expect(value1).toBe(value2);
      expect(value1).toEqual(['write', 'wrote', 'written']);
    });
  });

  describe('edge cases', () => {
    it('should handle regular verbs where past and past participle are the same', () => {
      const verbForms = VerbForms.fromArray(['walk', 'walked', 'walked']);
      
      expect(verbForms.value).toEqual(['walk', 'walked', 'walked']);
    });

    it('should handle irregular verbs where all forms are the same', () => {
      const verbForms = VerbForms.fromArray(['cut', 'cut', 'cut']);
      
      expect(verbForms.value).toEqual(['cut', 'cut', 'cut']);
    });

    it('should handle verbs with numbers and symbols', () => {
      const verbForms = VerbForms.fromArray(['re-do', 're-did', 're-done']);
      
      expect(verbForms.value).toEqual(['re-do', 're-did', 're-done']);
    });

    it('should handle long verb forms', () => {
      const longForms: [string, string, string] = [
        'misunderstand', 
        'misunderstood', 
        'misunderstood'
      ];
      const verbForms = VerbForms.fromArray(longForms);
      
      expect(verbForms.value).toEqual(longForms);
    });
  });
});