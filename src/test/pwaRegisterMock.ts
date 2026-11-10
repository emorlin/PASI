import { useState } from 'react';
import { vi } from 'vitest';

/** Testersättning för `virtual:pwa-register/react`. Styrs via `pwaMock`. */
export const pwaMock = {
  needRefresh: false,
  updateServiceWorker: vi.fn(async () => {}),
};

export function useRegisterSW() {
  const needRefresh = useState(pwaMock.needRefresh);
  const offlineReady = useState(false);
  return { needRefresh, offlineReady, updateServiceWorker: pwaMock.updateServiceWorker };
}
