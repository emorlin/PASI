import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from './App';

function radio(region: string, field: string, value: number) {
  const regionGroup = screen.getByRole('group', { name: region });
  const fieldGroup = within(regionGroup).getByRole('group', { name: new RegExp(`^${field}`) });
  return within(fieldGroup).getByRole('radio', { name: new RegExp(`^${value} `) });
}

function total() {
  return screen.getByText('PASI').parentElement!;
}

describe('kalkylatorn', () => {
  it('börjar med alla fält på 0 och PASI 0,0', () => {
    render(<App />);
    const radios = screen.getAllByRole('radio', { checked: true });
    expect(radios).toHaveLength(16);
    radios.forEach((r) => expect(r).toHaveAccessibleName(/^0 /));
    expect(total()).toHaveTextContent('PASI 0,0');
    expect(total()).toHaveAttribute('aria-live', 'polite');
    expect(screen.queryByRole('button', { name: /Nollställ/ })).not.toBeInTheDocument();
  });

  it('räknar exemplet till 21,4 och visar delsummor', async () => {
    const user = userEvent.setup();
    render(<App />);
    const set: [string, [number, number, number, number]][] = [
      ['Huvud', [2, 1, 2, 2]],
      ['Bål', [2, 2, 2, 3]],
      ['Armar', [1, 1, 1, 1]],
      ['Ben', [3, 3, 3, 4]],
    ];
    for (const [region, [e, i, s, a]] of set) {
      await user.click(radio(region, 'Rodnad', e));
      await user.click(radio(region, 'Tjocklek', i));
      await user.click(radio(region, 'Fjällning', s));
      await user.click(radio(region, 'Utbredning', a));
    }
    expect(total()).toHaveTextContent('PASI 21,4');
    const result = screen.getByRole('complementary', { name: 'Resultat' });
    expect(within(result).getByText('Ben').nextSibling).toHaveTextContent('14,4');
    expect(within(result).getByText('Huvud').nextSibling).toHaveTextContent('1,0');
  });

  it('behåller värden efter navigering till /om och tillbaka', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(radio('Bål', 'Rodnad', 3));
    await user.click(radio('Bål', 'Utbredning', 2));

    await user.click(screen.getByRole('link', { name: 'Om' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Om PASI-kalkylatorn' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Versionshistorik' })).toBeInTheDocument();

    await user.click(screen.getAllByRole('link', { name: /Tillbaka till kalkylatorn/ })[0]!);
    expect(await screen.findByRole('heading', { level: 1, name: 'PASI-bedömning' })).toBeInTheDocument();
    expect(radio('Bål', 'Rodnad', 3)).toBeChecked();
    expect(radio('Bål', 'Utbredning', 2)).toBeChecked();
    expect(total()).toHaveTextContent('PASI 1,8');
  });

  it('Nollställ med bekräftelse återställer alla fält till 0', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(radio('Huvud', 'Rodnad', 4));
    await user.click(radio('Ben', 'Utbredning', 6));
    await user.click(radio('Armar', 'Fjällning', 2));

    await user.click(screen.getByRole('button', { name: 'Nollställ' }));
    // Avbryt behåller värdena.
    await user.click(screen.getByRole('button', { name: 'Avbryt' }));
    expect(radio('Huvud', 'Rodnad', 4)).toBeChecked();

    await user.click(screen.getByRole('button', { name: 'Nollställ' }));
    expect(screen.getByText('Nollställa alla värden?')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Ja, nollställ' }));

    const checked = screen.getAllByRole('radio', { checked: true });
    expect(checked).toHaveLength(16);
    checked.forEach((r) => expect(r).toHaveAccessibleName(/^0 /));
    expect(total()).toHaveTextContent('PASI 0,0');
    expect(screen.queryByRole('button', { name: 'Nollställ' })).not.toBeInTheDocument();
  });

  it('alla kontroller går att nå och använda med tangentbordet', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Tabba igenom sidan och samla vilka radiogrupper som får fokus.
    const reachedGroups = new Set<string>();
    let reachedAbout = false;
    for (let i = 0; i < 40; i++) {
      await user.tab();
      const el = document.activeElement as HTMLInputElement | null;
      if (el?.type === 'radio') reachedGroups.add(el.name);
      if (el?.textContent === 'Om') reachedAbout = true;
    }
    expect(reachedGroups.size).toBe(16);
    expect(reachedAbout).toBe(true);

    // Välj värden med piltangenter.
    radio('Huvud', 'Rodnad', 0).focus();
    await user.keyboard('{ArrowRight}{ArrowRight}');
    expect(radio('Huvud', 'Rodnad', 2)).toBeChecked();
    radio('Huvud', 'Utbredning', 0).focus();
    await user.keyboard('{ArrowRight}');
    expect(total()).toHaveTextContent('PASI 0,2');

    // Nollställ via tangentbordet.
    screen.getByRole('button', { name: 'Nollställ' }).focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('button', { name: 'Avbryt' })).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(screen.getByRole('button', { name: 'Nollställ' })).toHaveFocus();
    await user.keyboard(' ');
    await user.tab({ shift: true });
    expect(screen.getByRole('button', { name: 'Ja, nollställ' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(total()).toHaveTextContent('PASI 0,0');
  });
});
