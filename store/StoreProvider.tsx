'use client';

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from './store';

/**
 * StoreProvider wraps the application and provides Redux context.
 * In Next.js App Router, context providers must be Client Components ("use client").
 * We use a ref to ensure that the store is instantiated only once per client session.
 */
export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore>(null);
  
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
