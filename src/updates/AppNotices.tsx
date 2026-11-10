import { useEffect, useRef } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import RefreshCw from 'lucide-react/icons/refresh-cw';
import Sparkles from 'lucide-react/icons/sparkles';
import { changelog as defaultChangelog, type ChangelogEntry } from '../changelog';
import { Notice } from './Notice';
import { useWhatsNew, type StorageGetter } from './useWhatsNew';
import styles from './Notice.module.css';

type Props = {
  version?: string;
  changelog?: readonly ChangelogEntry[];
  getStorage?: StorageGetter;
};

/** Visar högst en notis åt gången. Uppdateringsnotisen går före nyhetsnotisen. */
export function AppNotices({
  version = __APP_VERSION__,
  changelog = defaultChangelog,
  getStorage,
}: Props) {
  const registration = useRef<ServiceWorkerRegistration | undefined>(undefined);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, reg) {
      registration.current = reg;
      // Kontrollera om det finns en ny version direkt vid start.
      reg?.update().catch(() => {});
    },
  });

  useEffect(() => {
    // Kontrollera igen när appen kommer tillbaka i fokus.
    const onVisible = () => {
      if (document.visibilityState === 'visible') registration.current?.update().catch(() => {});
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, []);

  const { entries, dismiss } = useWhatsNew(version, changelog, getStorage);

  if (needRefresh) {
    const later = () => setNeedRefresh(false);
    return (
      <Notice
        title="En ny version finns"
        icon={<RefreshCw size={20} aria-hidden="true" />}
        onEscape={later}
        actions={
          <>
            <button
              type="button"
              className={styles.primary}
              onClick={() => void updateServiceWorker(true)}
            >
              Uppdatera
            </button>
            <button type="button" className={styles.secondary} onClick={later}>
              Senare
            </button>
          </>
        }
      />
    );
  }

  if (entries.length > 0) {
    return (
      <Notice
        title={`Nytt i version ${version}`}
        icon={<Sparkles size={20} aria-hidden="true" />}
        onEscape={dismiss}
        actions={
          <button type="button" className={styles.primary} onClick={dismiss}>
            OK
          </button>
        }
      >
        <ul>
          {entries.flatMap((entry) =>
            entry.items.map((item, i) => <li key={`${entry.version}-${i}`}>{item}</li>),
          )}
        </ul>
      </Notice>
    );
  }

  return null;
}
