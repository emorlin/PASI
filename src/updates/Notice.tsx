import { useEffect, type ReactNode } from 'react';
import styles from './Notice.module.css';

type Props = {
  title: string;
  icon?: ReactNode;
  children?: ReactNode;
  actions: ReactNode;
  /** Anropas när användaren trycker Escape. */
  onEscape: () => void;
};

/**
 * Notis i dokumentflödet under headern, så att den aldrig täcker resultatraden.
 * role="status" gör att skärmläsare läser upp den utan att fokus flyttas.
 */
export function Notice({ title, icon, children, actions, onEscape }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !e.defaultPrevented) onEscape();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onEscape]);

  return (
    <div className={styles.notice} role="status">
      {icon && <span className={styles.icon}>{icon}</span>}
      <div className={styles.body}>
        <p className={styles.title}>{title}</p>
        {children}
      </div>
      <div className={styles.actions}>{actions}</div>
    </div>
  );
}
