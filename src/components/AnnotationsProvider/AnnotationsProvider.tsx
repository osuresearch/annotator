import React, { useCallback, useMemo, useState } from 'react';
import { useAnnotations, Context } from '../../hooks/useAnnotations';
import { AnnotationSelection, Context as SelectionContext } from '../../hooks/useAnnotationPicker';

export type AnnotationsProviderProps = {
  children: React.ReactNode;
  initialItems?: Annotation[];
};

/**
 * Thin wrapper around the useAnnotations hook.
 */
export function AnnotationsProvider({ children, initialItems }: AnnotationsProviderProps) {
  const ctx = useAnnotations(initialItems);

  const [selected, select] = useState<AnnotationSelection>();

  const selectionCtx = useMemo(
    () => ({
      select,
      selected,
      deselect: () => select(undefined)
    }),
    [selected]
  );

  return (
    <Context.Provider value={ctx}>
      <SelectionContext.Provider value={selectionCtx}>{children}</SelectionContext.Provider>
    </Context.Provider>
  );
}
