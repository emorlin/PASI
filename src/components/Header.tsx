import { Link, NavLink } from 'react-router';
import Calculator from 'lucide-react/icons/calculator';
import Info from 'lucide-react/icons/info';
import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          <span className={styles.logo} aria-hidden="true">
            <Calculator size={20} />
          </span>
          PASI-kalkylator
        </Link>
        <NavLink to="/om" className={styles.navLink}>
          <Info size={20} aria-hidden="true" />
          Om
        </NavLink>
      </div>
    </header>
  );
}
