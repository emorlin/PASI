import { REGIONS, type PasiValues, type RegionValues } from './model';

/**
 * Delsumma för en region i tiondelar: (E + I + S) × A × heltalsvikt.
 * Heltal hela vägen, så att inga flyttalsfel uppstår.
 */
export function regionTenths(values: RegionValues, weight: number): number {
  return (values.E + values.I + values.S) * values.A * weight;
}

/** PASI-summan i tiondelar (0–720). */
export function pasiTenths(values: PasiValues): number {
  return REGIONS.reduce((sum, region) => sum + regionTenths(values[region.id], region.weight), 0);
}

/** PASI = Σ (E + I + S) × A × vikt. Division med 10 sker först här i slutet. */
export function calculatePasi(values: PasiValues): number {
  return pasiTenths(values) / 10;
}

/**
 * Formaterar ett värde i tiondelar med en decimal och decimalkomma, t.ex. 214 → "21,4".
 * Arbetar på heltal så att avrundning aldrig ger "5,39999".
 */
export function formatTenths(tenths: number): string {
  const rounded = Math.round(tenths);
  const sign = rounded < 0 ? '-' : '';
  const abs = Math.abs(rounded);
  return `${sign}${Math.floor(abs / 10)},${abs % 10}`;
}

/** Formaterar ett PASI-värde med en decimal och decimalkomma, t.ex. 5.4 → "5,4". */
export function formatPasi(value: number): string {
  return formatTenths(Math.round(value * 10));
}
