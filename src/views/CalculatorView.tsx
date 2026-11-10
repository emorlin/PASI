import { RegionCard } from '../components/RegionCard';
import { ResultPanel } from '../components/ResultPanel';
import { REGIONS } from '../pasi/model';
import styles from './CalculatorView.module.css';

export function CalculatorView() {
  const focusHeading = () => document.getElementById('page-heading')?.focus();

  return (
    <div className={styles.layout}>
      <div className={styles.content}>
        <div className={styles.intro}>
          <h1 id="page-heading" tabIndex={-1} className={styles.title}>
            PASI-bedömning
          </h1>
          <p className={styles.lead}>
            Välj rodnad, tjocklek, fjällning och utbredning för varje region. Resultatet
            uppdateras direkt.
          </p>
        </div>
        <form className={styles.cards} aria-labelledby="page-heading" onSubmit={(e) => e.preventDefault()}>
          {REGIONS.map((region) => (
            <RegionCard key={region.id} region={region} />
          ))}
        </form>
      </div>
      <ResultPanel onReset={focusHeading} />
    </div>
  );
}
