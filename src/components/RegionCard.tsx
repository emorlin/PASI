import { FIELDS, type Region } from '../pasi/model';
import { usePasi } from '../state/PasiContext';
import { BodySilhouette } from './BodySilhouette';
import { SegmentedControl } from './SegmentedControl';
import styles from './RegionCard.module.css';

const ERYTHEMA_SWATCHES = [0, 1, 2, 3, 4].map((i) => `var(--erythema-${i})`);

export function RegionCard({ region }: { region: Region }) {
  const { values, setValue } = usePasi();
  const regionValues = values[region.id];
  const helpId = `${region.id}-help`;

  return (
    <fieldset className={styles.card} aria-describedby={helpId}>
      <legend className={styles.legend}>
        <BodySilhouette region={region.id} />
        <h2 className={styles.title}>{region.name}</h2>
      </legend>
      <div id={helpId} className={styles.help}>
        <p>
          {region.description} = {region.bodyPercent} % av kroppsytan (1 handflata = {region.palmPercent} %)
        </p>
      </div>
      <div className={styles.fields}>
        {FIELDS.map((field) => (
          <SegmentedControl
            key={field.id}
            name={`${region.id}-${field.id}`}
            legend={field.name}
            abbreviation={field.id}
            labels={field.labels}
            value={regionValues[field.id]}
            onChange={(v) => setValue(region.id, field.id, v)}
            swatches={field.id === 'E' ? ERYTHEMA_SWATCHES : undefined}
            wide={field.id === 'A'}
          />
        ))}
      </div>
    </fieldset>
  );
}
