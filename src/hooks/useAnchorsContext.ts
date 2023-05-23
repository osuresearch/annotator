import { useContext } from 'react';
import { IAnchorsContext, AnchorsContext } from './useAnchors';

export type UseAnchorsContextReturn = IAnchorsContext;

export function useAnchorsContext(): UseAnchorsContextReturn {
  const ctx = useContext(AnchorsContext);
  return ctx;
}
