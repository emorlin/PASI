export type ChangelogEntry = {
  /** semver, samma som package.json */
  version: string;
  /** ISO 8601 */
  date: string;
  /** Användarvänliga beskrivningar på svenska. Tom lista = ingen nyhetsnotis (t.ex. en bugfix). */
  items: string[];
};

/** Senaste versionen först. Lägg till en post varje gång versionen i package.json höjs. */
export const changelog: ChangelogEntry[] = [
  {
    version: '1.0.1',
    date: '2026-11-11',
    items: [
      'Tydligare beskrivning av vad varje region omfattar, till exempel "Bål med ljumskar, axiller, underliv".',
      'Utbredning 0 heter nu bara "Ingen".',
    ],
  },
  {
    version: '1.0.0',
    date: '2026-11-10',
    items: [
      'Räkna ut PASI för huvud, bål, armar och ben.',
      'Resultatet uppdateras direkt och visas per region.',
      'Appen meddelar när en ny version finns.',
    ],
  },
];
