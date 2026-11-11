import { Link } from 'react-router';
import ArrowLeft from 'lucide-react/icons/arrow-left';
import { changelog } from '../changelog';
import { FIELDS, REGIONS } from '../pasi/model';
import styles from './About.module.css';

const dateFormat = new Intl.DateTimeFormat('sv-SE', { dateStyle: 'long' });

function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : dateFormat.format(d);
}

export function About() {
  return (
    <article className={styles.about}>
      <Link to="/" className={styles.back}>
        <ArrowLeft size={20} aria-hidden="true" />
        Tillbaka till kalkylatorn
      </Link>

      <h1 id="page-heading" tabIndex={-1} className={styles.title}>
        Om PASI-kalkylatorn
      </h1>

      <section aria-labelledby="what">
        <h2 id="what">Vad är PASI?</h2>
        <p>
          PASI (Psoriasis Area and Severity Index) är ett mått på hur utbredd och svår en psoriasis
          är. Kroppen delas in i fyra regioner. För varje region bedöms rodnad, tjocklek och
          fjällning, och hur stor del av regionen som är påverkad. Resultatet blir ett tal mellan
          0 och 72.
        </p>
      </section>

      <section aria-labelledby="formula">
        <h2 id="formula">Formel och vikter</h2>
        <p className={styles.formula}>
          PASI = Σ (E + I + S) × A × vikt
        </p>
        <div className={styles.tableWrap} role="region" aria-label="Vikter per region" tabIndex={0}>
          <table>
            <caption className="visually-hidden">Vikter per region</caption>
            <thead>
              <tr>
                <th scope="col">Region</th>
                <th scope="col">Omfattar</th>
                <th scope="col">Andel av kroppsytan</th>
                <th scope="col">Vikt</th>
              </tr>
            </thead>
            <tbody>
              {REGIONS.map((r) => (
                <tr key={r.id}>
                  <th scope="row">{r.name}</th>
                  <td>{r.description}</td>
                  <td>{r.bodyPercent} %</td>
                  <td>0,{r.weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Appen räknar med heltal och dividerar med 10 först i slutet, så att inga
          avrundningsfel uppstår. Resultatet visas med en decimal.
        </p>
      </section>

      <section aria-labelledby="scales">
        <h2 id="scales">Så tolkas poängen</h2>
        <p>
          Rodnad (E), tjocklek (I) och fjällning (S) bedöms från 0 till 4. Utbredning (A) anges
          som poäng från 0 till 6, där 0 betyder ingen utbredning.
        </p>
        <div className={styles.tableWrap} role="region" aria-label="Poängskalor" tabIndex={0}>
          <table>
            <caption className="visually-hidden">Poängskalor</caption>
            <thead>
              <tr>
                <th scope="col">Poäng</th>
                {FIELDS.map((f) => (
                  <th key={f.id} scope="col">
                    {f.name} ({f.id})
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[0, 1, 2, 3, 4, 5, 6].map((score) => (
                <tr key={score}>
                  <th scope="row">{score}</th>
                  {FIELDS.map((f) => (
                    <td key={f.id}>{f.labels[score] ?? '–'}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="privacy">
        <h2 id="privacy">Integritet</h2>
        <p>
          Inga uppgifter sparas eller skickas någonstans. All beräkning sker i din webbläsare och
          värdena försvinner när sidan laddas om. Det enda appen sparar är vilken version du
          senast har sett, så att den kan berätta om nyheter.
        </p>
      </section>

      <section aria-labelledby="disclaimer">
        <h2 id="disclaimer">Viktigt</h2>
        <p>
          Appen är ett hjälpmedel för uträkningen och ersätter inte klinisk bedömning.
        </p>
      </section>

      <section aria-labelledby="history">
        <h2 id="history">Versionshistorik</h2>
        <p>
          Aktuell version: <strong>{__APP_VERSION__}</strong>
        </p>
        <ol className={styles.history}>
          {changelog.map((entry) => (
            <li key={entry.version}>
              <h3 className={styles.versionHeading}>
                Version {entry.version}{' '}
                <span className={styles.date}>
                  <time dateTime={entry.date}>{formatDate(entry.date)}</time>
                </span>
              </h3>
              {entry.items.length > 0 ? (
                <ul>
                  {entry.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className={styles.minor}>Mindre rättningar.</p>
              )}
            </li>
          ))}
        </ol>
      </section>

      <Link to="/" className={styles.back}>
        <ArrowLeft size={20} aria-hidden="true" />
        Tillbaka till kalkylatorn
      </Link>
    </article>
  );
}
