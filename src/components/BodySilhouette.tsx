import type { RegionId } from '../pasi/model';
import styles from './BodySilhouette.module.css';

/** Liten kroppssiluett där en region är markerad. Dekorativ. */
export function BodySilhouette({ region }: { region: RegionId }) {
  const cls = (id: RegionId) => (id === region ? `${styles.part} ${styles.active}` : styles.part);
  return (
    <svg className={styles.svg} viewBox="0 0 48 96" aria-hidden="true" focusable="false">
      <g className={cls('head')}>
        <circle cx="24" cy="9.5" r="7.5" />
        <rect x="21" y="16" width="6" height="4" rx="1.5" />
      </g>
      <path className={cls('trunk')} d="M14 21h20a3 3 0 0 1 3 3v22a4 4 0 0 1-1 2.6V52H12v-3.4a4 4 0 0 1-1-2.6V24a3 3 0 0 1 3-3z" />
      <g className={cls('arms')}>
        <path d="M9.6 22.5a3 3 0 0 1 3.4 2.6l-.4 23.3L9 58a2.6 2.6 0 0 1-5-1.2l2.6-10.2L6.9 25a3 3 0 0 1 2.7-2.5z" />
        <path d="M38.4 22.5a3 3 0 0 0-3.4 2.6l.4 23.3L39 58a2.6 2.6 0 0 0 5-1.2l-2.6-10.2-.3-21.6a3 3 0 0 0-2.7-2.5z" />
      </g>
      <g className={cls('legs')}>
        <path d="M12 53.5h11v36.5a3 3 0 0 1-3 3h-2.5a3 3 0 0 1-3-2.8z" />
        <path d="M25 53.5h11l-2.5 36.7a3 3 0 0 1-3 2.8H28a3 3 0 0 1-3-3z" />
      </g>
    </svg>
  );
}
