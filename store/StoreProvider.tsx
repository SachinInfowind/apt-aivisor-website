'use client';

import { useState } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from './store';

/**
 * StoreProvider wraps the application and provides Redux context.
 * In Next.js App Router, context providers must be Client Components ("use client").
 * A lazy useState initializer ensures the store is instantiated only once per client session.
 */
export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState<AppStore>(() => makeStore());

  return <Provider store={store}>{children}</Provider>;
}
