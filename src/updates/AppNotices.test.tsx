import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import type { ChangelogEntry } from '../changelog';
import { pwaMock } from '../test/pwaRegisterMock';
import { AppNotices } from './AppNotices';
import { compareVersions, entriesSince } from './semver';
import { LAST_SEEN_KEY } from './useWhatsNew';

const log: ChangelogEntry[] = [
  { version: '1.2.0', date: '2026-03-01', items: ['Nyhet i 1.2.0'] },
  { version: '1.1.1', date: '2026-02-15', items: [] },
  { version: '1.1.0', date: '2026-02-01', items: ['Nyhet i 1.1.0', 'Till i 1.1.0'] },
  { version: '1.0.0', date: '2026-01-01', items: ['Första versionen'] },
];

function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    data,
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
  };
}

beforeEach(() => {
  pwaMock.needRefresh = false;
  pwaMock.updateServiceWorker.mockClear();
});

describe('semver', () => {
  it('jämför versioner numeriskt', () => {
    expect(compareVersions('1.10.0', '1.9.0')).toBeGreaterThan(0);
    expect(compareVersions('1.0.0', '1.0.0')).toBe(0);
    expect(compareVersions('0.9.9', '1.0.0')).toBeLessThan(0);
  });

  it('hoppar över versioner utan punkter', () => {
    expect(entriesSince(log, '1.1.0', '1.1.1')).toEqual([]);
  });
});

describe('nyhetsnotis', () => {
  it('ingen sparad version → ingen notis, versionen sparas', () => {
    const storage = memoryStorage();
    render(<AppNotices version="1.2.0" changelog={log} getStorage={() => storage} />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(storage.data.get(LAST_SEEN_KEY)).toBe('1.2.0');
  });

  it('sparad 1.0.0, aktuell 1.2.0 → punkterna från 1.1.0 och 1.2.0 visas', async () => {
    const storage = memoryStorage({ [LAST_SEEN_KEY]: '1.0.0' });
    render(<AppNotices version="1.2.0" changelog={log} getStorage={() => storage} />);
    const notice = await screen.findByRole('status');
    expect(notice).toHaveTextContent('Nytt i version 1.2.0');
    expect(notice).toHaveTextContent('Nyhet i 1.1.0');
    expect(notice).toHaveTextContent('Till i 1.1.0');
    expect(notice).toHaveTextContent('Nyhet i 1.2.0');
    expect(notice).not.toHaveTextContent('Första versionen');
    // Inte sparad förrän användaren trycker OK.
    expect(storage.data.get(LAST_SEEN_KEY)).toBe('1.0.0');

    await userEvent.click(screen.getByRole('button', { name: 'OK' }));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(storage.data.get(LAST_SEEN_KEY)).toBe('1.2.0');
  });

  it('stängs med Escape och sparar då versionen', async () => {
    const storage = memoryStorage({ [LAST_SEEN_KEY]: '1.0.0' });
    render(<AppNotices version="1.2.0" changelog={log} getStorage={() => storage} />);
    await screen.findByRole('status');
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(storage.data.get(LAST_SEEN_KEY)).toBe('1.2.0');
  });

  it('sparad version = aktuell version → ingen notis', () => {
    const storage = memoryStorage({ [LAST_SEEN_KEY]: '1.2.0' });
    render(<AppNotices version="1.2.0" changelog={log} getStorage={() => storage} />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('version utan punkter → ingen notis', () => {
    const storage = memoryStorage({ [LAST_SEEN_KEY]: '1.1.0' });
    render(<AppNotices version="1.1.1" changelog={log} getStorage={() => storage} />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('localStorage kastar ett fel → appen fungerar, ingen notis', () => {
    const throwing = () => {
      throw new DOMException('Blockerad', 'SecurityError');
    };
    render(
      <AppNotices
        version="1.2.0"
        changelog={log}
        getStorage={() => ({ getItem: throwing, setItem: throwing })}
      />,
    );
    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    render(<AppNotices version="1.2.0" changelog={log} getStorage={throwing} />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});

describe('uppdateringsnotis', () => {
  it('visas före nyhetsnotisen och "Uppdatera" anropar updateServiceWorker(true)', async () => {
    pwaMock.needRefresh = true;
    const storage = memoryStorage({ [LAST_SEEN_KEY]: '1.0.0' });
    render(<AppNotices version="1.2.0" changelog={log} getStorage={() => storage} />);

    const notices = screen.getAllByRole('status');
    expect(notices).toHaveLength(1);
    expect(notices[0]).toHaveTextContent('En ny version finns');

    await userEvent.click(screen.getByRole('button', { name: 'Uppdatera' }));
    expect(pwaMock.updateServiceWorker).toHaveBeenCalledWith(true);
  });

  it('"Senare" stänger den, och sedan visas nyhetsnotisen', async () => {
    pwaMock.needRefresh = true;
    const storage = memoryStorage({ [LAST_SEEN_KEY]: '1.0.0' });
    render(<AppNotices version="1.2.0" changelog={log} getStorage={() => storage} />);

    await userEvent.click(screen.getByRole('button', { name: 'Senare' }));
    expect(screen.getByRole('status')).toHaveTextContent('Nytt i version 1.2.0');
  });

  it('är nåbar med tangentbordet och stängs med Escape', async () => {
    pwaMock.needRefresh = true;
    render(<AppNotices version="1.2.0" changelog={log} getStorage={() => memoryStorage()} />);
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Uppdatera' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByText('En ny version finns')).not.toBeInTheDocument();
  });
});
