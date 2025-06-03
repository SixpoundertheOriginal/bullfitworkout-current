import { describe, it, expect } from 'vitest';
import { convertWeight } from '@/utils/unitConversion';

describe('convertWeight', () => {
  it('converts kg to lb', () => {
    const result = convertWeight(100, 'kg', 'lb');
    expect(result).toBeCloseTo(220.5);
  });
});
