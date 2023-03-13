import React, { useCallback, useMemo, useState } from 'react';
import { useAnnotations, Context } from '../../hooks/useAnnotations';
import { AnnotationSelection, Context as SelectionContext } from '../../hooks/useAnnotationPicker';

export type AnnotationsProviderProps = {
  children: React.ReactNode;
  initialItems?: Annotation[];

  /**
   * The agent to use for newly created annotations
   */
  agent: AnnotationAgent;

  /**
   * The role for the agent. This is heavily dependent
   * on the context in which the annotator is used.
   *
   * For forms, this could be `Submitter`, `Reviewer`,
   * `Analyst`, etc. Roles may also represent individual's
   * relationship to the submission, such as a `Principal Investigator`
   * versus a `Co-Investigator` on a study.
   */
  role: string;
};

/**
 * Thin wrapper around the useAnnotations hook.
 */
export function AnnotationsProvider({
  children,
  initialItems,
  agent,
  role
}: AnnotationsProviderProps) {
  const ctx = useAnnotations(initialItems, agent, role);

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
