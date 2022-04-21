export type CompactNumOptions = Partial<typeof defaultCompactNumOptions>;

const defaultCompactNumOptions = {
  k: 'K',
  m: 'M',
  g: 'G',
  t: 'T'
};

export function compactNum(
  num: number,
  options: CompactNumOptions = defaultCompactNumOptions
): string {
  let rounded = Math.round((num / 1_000_000_000_000) * 100) / 100;
  let unit = options.t;
  if (rounded < 1) {
    rounded = Math.round((num / 1_000_000_000) * 100) / 100;
    unit = options.g;
  }
  if (rounded < 1) {
    rounded = Math.round((num / 1_000_000) * 100) / 100;
    unit = options.m;
  }
  if (rounded < 1) {
    rounded = Math.round((num / 1_000) * 100) / 100;
    unit = options.k;
  }
  return rounded.toLocaleString() + (unit ?? '');
}

export type CompactUptimeOptions = Partial<typeof defaultCompactUptimeOptions>;

const defaultCompactUptimeOptions = {
  m: ' mins',
  h: ' hours',
  d: ' days'
};

export function compactUptime(
  uptine: number,
  options: CompactUptimeOptions = defaultCompactUptimeOptions
): string {
  const days = 1000 * 60 * 60 * 24;
  const hours = 1000 * 60 * 60;
  const mins = 1000 * 60;

  let rounded = Math.round((uptine / days) * 100) / 100;
  let unit = options.d;
  if (rounded < 1) {
    rounded = Math.round((uptine / hours) * 100) / 100;
    unit = options.h;
  }
  if (rounded < 1) {
    rounded = Math.round((uptine / mins) * 100) / 100;
    unit = options.m;
  }
  return rounded.toLocaleString() + (unit ?? '');
}
