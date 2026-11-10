import { useEffect, useRef, useState } from 'react';
import RotateCcw from 'lucide-react/icons/rotate-ccw';
import { formatTenths, pasiTenths, regionTenths } from '../pasi/calc';
import { REGIONS } from '../pasi/model';
import { usePasi } from '../state/PasiContext';
import styles from './ResultPanel.module.css';

type Props = {
  /** Anropas efter nollställning, t.ex. för att flytta fokus. */
  onReset?: () => void;
};

export function ResultPanel({ onReset }: Props) {
  const { values, reset } = usePasi();
  const [confirming, setConfirming] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const resetRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef(false);

  const total = formatTenths(pasiTenths(values));
  const hasValues = REGIONS.some((r) => Object.values(values[r.id]).some((v) => v !== 0));

  useEffect(() => {
    if (confirming) cancelRef.current?.focus();
  }, [confirming]);

  useEffect(() => {
    if (!hasValues) setConfirming(false);
  }, [hasValues]);

  useEffect(() => {
    if (!confirming && returnFocus.current) {
      returnFocus.current = false;
      resetRef.current?.focus();
    }
  }, [confirming]);

  const confirmReset = () => {
    reset();
    setConfirming(false);
    onReset?.();
  };

  const cancel = () => {
    returnFocus.current = true;
    setConfirming(false);
  };

  return (
    <aside className={styles.panel} aria-labelledby="result-heading">
      <h2 id="result-heading" className={styles.heading}>
        Resultat
      </h2>

      <div className={styles.main}>
        <p className={styles.total} aria-live="polite" aria-atomic="true">
          <span className={styles.totalLabel}>PASI</span>{' '}
          <span key={total} className={styles.totalValue}>
            {total}
          </span>
        </p>

        <dl className={styles.regions}>
          {REGIONS.map((region) => (
            <div key={region.id} className={styles.region}>
              <dt>{region.name}</dt>
              <dd>{formatTenths(regionTenths(values[region.id], region.weight))}</dd>
            </div>
          ))}
        </dl>
      </div>

      {hasValues && (
        <div className={styles.reset} data-confirming={confirming || undefined}>
          {confirming ? (
            <div
              className={styles.confirm}
              role="group"
              aria-labelledby="reset-question"
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  e.preventDefault();
                  cancel();
                }
              }}
            >
              <p id="reset-question" className={styles.question}>
                Nollställa alla värden?
              </p>
              <div className={styles.confirmButtons}>
                <button type="button" className={styles.danger} onClick={confirmReset}>
                  Ja, nollställ
                </button>
                <button type="button" ref={cancelRef} className={styles.secondary} onClick={cancel}>
                  Avbryt
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              ref={resetRef}
              className={styles.secondary}
              onClick={() => setConfirming(true)}
            >
              <RotateCcw size={18} aria-hidden="true" />
              Nollställ
            </button>
          )}
        </div>
      )}
    </aside>
  );
}
