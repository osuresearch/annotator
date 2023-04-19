import { useContext } from 'react';
import { IAnnotationsContext, AnnotationsContext } from './useAnnotations';

export type UseAnnotationsContextReturn = IAnnotationsContext;

export function useAnnotationsContext(): UseAnnotationsContextReturn {
  const ctx = useContext(AnnotationsContext);
  return ctx;
}
