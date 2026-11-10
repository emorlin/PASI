import type { ChangelogEntry } from '../changelog';

function parse(version: string): [number, number, number] | null {
  const m = /^(\d+)\.(\d+)\.(\d+)/.exec(version.trim());
  if (!m) return null;
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

/** Negativt om a < b, 0 om lika, positivt om a > b. Ogiltiga versioner räknas som 0.0.0. */
export function compareVersions(a: string, b: string): number {
  const pa = parse(a) ?? [0, 0, 0];
  const pb = parse(b) ?? [0, 0, 0];
  for (let i = 0; i < 3; i++) {
    const diff = pa[i]! - pb[i]!;
    if (diff !== 0) return diff;
  }
  return 0;
}

/** Poster med lastSeen < version ≤ current som har minst en punkt, äldst först. */
export function entriesSince(
  log: readonly ChangelogEntry[],
  lastSeen: string,
  current: string,
): ChangelogEntry[] {
  return log
    .filter(
      (e) =>
        e.items.length > 0 &&
        compareVersions(e.version, lastSeen) > 0 &&
        compareVersions(e.version, current) <= 0,
    )
    .sort((a, b) => compareVersions(a.version, b.version));
}
