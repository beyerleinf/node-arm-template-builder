import { expect } from 'chai';
import { expr } from './utils';

describe('Utils', () => {
  describe('expr', () => {
    it('should wrap string in brackets', () => {
      const arg = expr`This is a string`;

      expect(arg).to.eql('[This is a string]');
    });

    it('should maintain string interpolation order', () => {
      const arg1 = 'a';
      const arg2 = 'multiple arguments.';
      const arg = expr`This is ${arg1} string with ${arg2}`;

      expect(arg).to.eql('[This is a string with multiple arguments.]');
    });
  });
});
