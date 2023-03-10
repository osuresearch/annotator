import { useContext } from 'react';
import { AnnotationsContext, Context } from './useAnnotations';

export type UseAnnotationsContextReturn = AnnotationsContext;

export function useAnnotationsContext(): UseAnnotationsContextReturn {
  const ctx = useContext(Context);
  return ctx;
}
