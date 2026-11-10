import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react';
import { emptyValues, type FieldId, type PasiValues, type RegionId } from '../pasi/model';

type Action =
  | { type: 'set'; region: RegionId; field: FieldId; value: number }
  | { type: 'reset' };

function reducer(state: PasiValues, action: Action): PasiValues {
  switch (action.type) {
    case 'set':
      return { ...state, [action.region]: { ...state[action.region], [action.field]: action.value } };
    case 'reset':
      return emptyValues();
  }
}

type PasiContextValue = {
  values: PasiValues;
  setValue: (region: RegionId, field: FieldId, value: number) => void;
  reset: () => void;
};

const PasiContext = createContext<PasiContextValue | null>(null);

/**
 * Formulärets state. Ligger ovanför routern så att värdena finns kvar mellan vyerna.
 * Endast i minnet – försvinner avsiktligt vid omladdning.
 */
export function PasiProvider({ children }: { children: ReactNode }) {
  const [values, dispatch] = useReducer(reducer, undefined, emptyValues);
  const ctx = useMemo<PasiContextValue>(
    () => ({
      values,
      setValue: (region, field, value) => dispatch({ type: 'set', region, field, value }),
      reset: () => dispatch({ type: 'reset' }),
    }),
    [values],
  );
  return <PasiContext.Provider value={ctx}>{children}</PasiContext.Provider>;
}

export function usePasi(): PasiContextValue {
  const ctx = useContext(PasiContext);
  if (!ctx) throw new Error('usePasi måste användas inuti PasiProvider');
  return ctx;
}
