export type RegionId = 'head' | 'trunk' | 'arms' | 'legs';
export type FieldId = 'E' | 'I' | 'S' | 'A';

export type RegionValues = Record<FieldId, number>;
export type PasiValues = Record<RegionId, RegionValues>;

export type Region = {
  id: RegionId;
  name: string;
  /** Heltalsvikt, tiondelar (Huvud 0,1 → 1). */
  weight: number;
  /** Andel av kroppsytan i procent. */
  bodyPercent: number;
  palmPercent: string;
  /** Beskrivning av vilka kroppsdelar regionen omfattar. */
  description: string;
};

export type Field = {
  id: FieldId;
  name: string;
  labels: readonly string[];
};

export const REGIONS: readonly Region[] = [
  {
    id: 'head',
    name: 'Huvud',
    description: 'Huvud med nacke, hals',
    weight: 1,
    bodyPercent: 10,
    palmPercent: '10',
  },
  {
    id: 'trunk',
    name: 'Bål',
    description: 'Bål med ljumskar, axiller, underliv',
    weight: 3,
    bodyPercent: 30,
    palmPercent: '3,3',
  },
  {
    id: 'arms',
    name: 'Armar',
    description: 'Armar (minus armhålor)',
    weight: 2,
    bodyPercent: 20,
    palmPercent: '5',
  },
  {
    id: 'legs',
    name: 'Ben',
    description: 'Ben med skinkor',
    weight: 4,
    bodyPercent: 40,
    palmPercent: '2,5',
  },
];

export const FIELDS: readonly Field[] = [
  // ­ = mjukt bindestreck, så att långa ord avstavas snyggt på smala skärmar.
  { id: 'E', name: 'Rodnad', labels: ['Ingen', 'Ljusröd', 'Röd', 'Hallon­röd', 'Mörkröd'] },
  { id: 'I', name: 'Tjocklek', labels: ['Ingen', 'Mild', 'Medel­svår', 'Svår', 'Mycket svår'] },
  {
    id: 'S',
    name: 'Fjällning',
    labels: ['Ingen', 'Lite fjäll', 'Halv­täckt', 'Mycket fjäll', 'Helt täckt'],
  },
  {
    id: 'A',
    name: 'Utbredning',
    labels: ['Ingen', '1–9 %', '10–29 %', '30–49 %', '50–69 %', '70–89 %', '90–100 %'],
  },
];

export const emptyRegion = (): RegionValues => ({ E: 0, I: 0, S: 0, A: 0 });

export const emptyValues = (): PasiValues => ({
  head: emptyRegion(),
  trunk: emptyRegion(),
  arms: emptyRegion(),
  legs: emptyRegion(),
});
