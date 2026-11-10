import styles from './SegmentedControl.module.css';

type Props = {
  name: string;
  legend: string;
  abbreviation: string;
  labels: readonly string[];
  value: number;
  onChange: (value: number) => void;
  /** CSS-färger per steg, visas som färgprov bredvid texten. */
  swatches?: readonly string[];
  wide?: boolean;
};

/** Radiogrupp med segmenterade knappar. Pilknappar byter värde, Tab går till nästa grupp. */
export function SegmentedControl({
  name,
  legend,
  abbreviation,
  labels,
  value,
  onChange,
  swatches,
  wide = false,
}: Props) {
  return (
    <fieldset className={styles.field}>
      <legend className={styles.legend}>
        {legend} <span className={styles.abbr}>({abbreviation})</span>
      </legend>
      <div className={wide ? `${styles.options} ${styles.wide}` : styles.options}>
        {labels.map((label, index) => (
          <label key={index} className={styles.option}>
            <input
              className={styles.input}
              type="radio"
              name={name}
              value={index}
              checked={value === index}
              onChange={() => onChange(index)}
            />
            <span className={styles.box}>
              <span className={styles.top}>
                {swatches && (
                  <span
                    className={styles.swatch}
                    style={{ background: swatches[index] }}
                    data-empty={index === 0 || undefined}
                    aria-hidden="true"
                  />
                )}
                <span className={styles.number}>{index}</span>
              </span>{' '}
              <span className={styles.text}>{label}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
