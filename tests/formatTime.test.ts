import { describe, it, expect } from 'vitest';
import { formatTime } from '../src/utils/formatTime';

describe('formatTime', () => {
  it('formats seconds to MM:SS', () => {
    expect(formatTime(90)).toBe('01:30');
  });
});
