import compareVersions from '@/pages/api/compareVersions.js'

describe('compareVersions', () => {
    test('returns -1 when first version is lower than second', () => {
      expect(compareVersions('1.0.0', '2.0.0')).toBe(-1);
      expect(compareVersions('1.0.0', '1.1.0')).toBe(-1);
      expect(compareVersions('1.1.0', '1.2.0')).toBe(-1);
      expect(compareVersions('1.2.0', '1.2.1')).toBe(-1);
      expect(compareVersions('1.2.0', '1.12.1')).toBe(-1);
    });

    test('returns 1 when first version is higher than second', () => {
      expect(compareVersions('2.0.0', '1.0.0')).toBe(1);
      expect(compareVersions('1.1.0', '1.0.0')).toBe(1);
      expect(compareVersions('1.2.0', '1.1.0')).toBe(1);
      expect(compareVersions('1.2.1', '1.2.0')).toBe(1);
      expect(compareVersions('1.210.11', '1.22.0')).toBe(1);
    });

    test('returns 0 when both versions are equal', () => {
      expect(compareVersions('1.0.0', '1.0.0')).toBe(0);
      expect(compareVersions('1.1.0', '1.1.0')).toBe(0);
      expect(compareVersions('1.2.0', '1.2.0')).toBe(0);
      expect(compareVersions('1.2.1', '1.2.1')).toBe(0);
    });
  });
