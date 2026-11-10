import { useCallback, useEffect, useState } from 'react';
import type { ChangelogEntry } from '../changelog';
import { compareVersions, entriesSince } from './semver';

/** Enda nyckeln appen sparar i localStorage. */
export const LAST_SEEN_KEY = 'pasi:lastSeenVersion';

export type StorageGetter = () => Pick<Storage, 'getItem' | 'setItem'>;

const defaultStorage: StorageGetter = () => window.localStorage;

/**
 * Avgör om nyhetsnotisen ska visas. Alla fel från localStorage (privat läge, blockerat)
 * fångas tyst – då visas ingen notis.
 */
export function useWhatsNew(
  currentVersion: string,
  log: readonly ChangelogEntry[],
  getStorage: StorageGetter = defaultStorage,
) {
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);

  useEffect(() => {
    try {
      const storage = getStorage();
      const saved = storage.getItem(LAST_SEEN_KEY);
      if (saved === null) {
        // Första besöket: ingen notis, spara bara aktuell version.
        storage.setItem(LAST_SEEN_KEY, currentVersion);
        return;
      }
      if (compareVersions(saved, currentVersion) >= 0) return;
      const news = entriesSince(log, saved, currentVersion);
      if (news.length > 0) setEntries(news);
      else storage.setItem(LAST_SEEN_KEY, currentVersion);
    } catch {
      // localStorage otillgängligt: visa ingen nyhetsnotis.
    }
  }, [currentVersion, log, getStorage]);

  const dismiss = useCallback(() => {
    setEntries([]);
    try {
      getStorage().setItem(LAST_SEEN_KEY, currentVersion);
    } catch {
      // Ignorera.
    }
  }, [currentVersion, getStorage]);

  return { entries, dismiss };
}
