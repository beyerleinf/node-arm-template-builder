import { expect } from 'chai';
import { uniqueString, concat, take } from './string-functions';

describe('String Functions', () => {
  describe('uniqueString', () => {
    it('should return correct string when input is strings', () => {
      const result = uniqueString('some', 'strings');

      expect(result).to.eql('uniqueString(some,strings)');
    });

    it('should return correct string when input is arrays', () => {
      const result = uniqueString(['some', 'strings'], ['are', 'meant', 'to be']);

      expect(result).to.eql('uniqueString([some,strings],[are,meant,to be])');
    });
  });

  describe('concat', () => {
    it('should return correct string when input is string', () => {
      const result = concat('some', 'strings');

      expect(result).to.eql('concat(some,strings)');
    });

    it('should return correct string when input is array', () => {
      const result = concat(['some', 'strings'], ['are', 'meant', 'to be']);

      expect(result).to.eql('concat([some,strings],[are,meant,to be])');
    });
  });

  describe('take', () => {
    it('should return correct string when input is string', () => {
      const result = take('some', 2);

      expect(result).to.eql('take(some,2)');
    });

    it('should return correct sting when input is array', () => {
      const result = take(['some', 'strings'], 2);

      expect(result).to.eql('take([some,strings],2)');
    });
  });
});
