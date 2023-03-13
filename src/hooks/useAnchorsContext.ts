import { useContext } from 'react';
import { AnchorsContext, Context } from './useAnchors';

export type UseAnchorsContextReturn = AnchorsContext;

export function useAnchorsContext(): UseAnchorsContextReturn {
  const ctx = useContext(Context);
  return ctx;
}
