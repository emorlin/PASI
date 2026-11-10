import { describe, expect, it } from 'vitest';
import { calculatePasi, formatPasi, formatTenths, pasiTenths, regionTenths } from './calc';
import { emptyValues, type PasiValues } from './model';

describe('calculatePasi', () => {
  it('ger 0,0 när alla värden är 0', () => {
    const v = emptyValues();
    expect(calculatePasi(v)).toBe(0);
    expect(formatTenths(pasiTenths(v))).toBe('0,0');
  });

  it('ger 72,0 när alla värden är max', () => {
    const max = { E: 4, I: 4, S: 4, A: 6 };
    const v: PasiValues = { head: { ...max }, trunk: { ...max }, arms: { ...max }, legs: { ...max } };
    expect(calculatePasi(v)).toBe(72);
    expect(formatTenths(pasiTenths(v))).toBe('72,0');
  });

  it('räknar exemplet till 21,4', () => {
    const v: PasiValues = {
      head: { E: 2, I: 1, S: 2, A: 2 },
      trunk: { E: 2, I: 2, S: 2, A: 3 },
      arms: { E: 1, I: 1, S: 1, A: 1 },
      legs: { E: 3, I: 3, S: 3, A: 4 },
    };
    expect(calculatePasi(v)).toBe(21.4);
    expect(formatTenths(pasiTenths(v))).toBe('21,4');
  });

  it('ger 0 för en region med utbredning 0 oavsett E, I och S', () => {
    expect(regionTenths({ E: 4, I: 4, S: 4, A: 0 }, 4)).toBe(0);
    const v = emptyValues();
    v.trunk = { E: 4, I: 3, S: 2, A: 0 };
    expect(calculatePasi(v)).toBe(0);
  });
});

describe('formatering', () => {
  it('använder decimalkomma och exakt en decimal', () => {
    expect(formatPasi(5.4)).toBe('5,4');
    expect(formatPasi(5.4)).not.toBe('5.4');
    expect(formatPasi(5.4)).not.toBe('5,40');
    expect(formatTenths(54)).toBe('5,4');
    expect(formatPasi(5)).toBe('5,0');
    expect(formatPasi(0.30000000000000004)).toBe('0,3');
  });
});
