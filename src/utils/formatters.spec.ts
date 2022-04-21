import { compactNum, compactUptime } from './formatters';

describe('number-format', () => {
  it('compactNum', () => {
    const opts = { k: 'K', m: 'M', g: 'G', t: 'T' };
    expect(compactNum(1000, opts)).toBe('1K');
    expect(compactNum(1100, opts)).toBe('1,1K');
    expect(compactNum(1110, opts)).toBe('1,11K');
    expect(compactNum(1111, opts)).toBe('1,11K');
    expect(compactNum(9999, opts)).toBe('10K');
    expect(compactNum(10199, opts)).toBe('10,2K');
    expect(compactNum(10099, opts)).toBe('10,1K');
    expect(compactNum(19999, opts)).toBe('20K');
    expect(compactNum(1_000_000, opts)).toBe('1M');
    expect(compactNum(1_000_001, opts)).toBe('1M');
    expect(compactNum(1_000_901, opts)).toBe('1M');
    expect(compactNum(1_090_901, opts)).toBe('1,09M');
    expect(compactNum(1_099_901, opts)).toBe('1,1M');
    expect(compactNum(1_999_901, opts)).toBe('2M');
    expect(compactNum(991_999_901, opts)).toBe('992M');
    expect(compactNum(991_139_901, opts)).toBe('991,14M');
    expect(compactNum(11_991_139_901, opts)).toBe('11,99G');
    expect(compactNum(123_011_991_139_901, opts)).toBe('123,01T');
  });

  it('compactUptime', () => {
    const opts = { m: 'M', h: 'H', d: 'D' };
    expect(compactUptime(1, opts)).toBe('0M');
    expect(compactUptime(23.3 * 1000 * 60, opts)).toBe('23,3M');
    expect(compactUptime(2.4 * 1000 * 60 * 60, opts)).toBe('2,4H');
    expect(compactUptime(24 * 1000 * 60 * 60 * 24, opts)).toBe('24D');
  });
});

export {};
