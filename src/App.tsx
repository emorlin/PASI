import { useEffect, useRef } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router';
import { Header } from './components/Header';
import { PasiProvider } from './state/PasiContext';
import { AppNotices } from './updates/AppNotices';
import { About } from './views/About';
import { CalculatorView } from './views/CalculatorView';
import styles from './App.module.css';

/** Flyttar fokus till sidans rubrik vid byte av vy (inte vid första laddningen). */
function useFocusOnNavigate() {
  const { pathname } = useLocation();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    window.scrollTo?.(0, 0);
    document.getElementById('page-heading')?.focus();
  }, [pathname]);
}

function Shell() {
  useFocusOnNavigate();
  return (
    <>
      <a className={styles.skip} href="#page-heading" onClick={(e) => {
        e.preventDefault();
        document.getElementById('page-heading')?.focus();
      }}>
        Hoppa till innehållet
      </a>
      <Header />
      <div className={styles.page}>
        <AppNotices />
        <main>
          <Routes>
            <Route path="/" element={<CalculatorView />} />
            <Route path="/om" element={<About />} />
            <Route path="*" element={<CalculatorView />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

/** Formulärets state ligger ovanför routern så att värdena finns kvar mellan vyerna. */
export function App() {
  return (
    <PasiProvider>
      <HashRouter>
        <Shell />
      </HashRouter>
    </PasiProvider>
  );
}
