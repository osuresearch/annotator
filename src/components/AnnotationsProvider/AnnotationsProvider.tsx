import React, { useMemo, useState } from 'react';
import { useAnnotations, Context } from '../../hooks/useAnnotations';
import { AnnotationSelection, Context as SelectionContext } from '../../hooks/useAnnotationPicker';
import { useEditors, Context as EditorsContext } from '../../hooks/useEditors';

export type AnnotationsProviderProps = {
  /**
   * Unique IRI of the document being annotated
   */
  documentId: string;

  /**
   * Initial annotation instances to display
   */
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

  children: React.ReactNode;
};

/**
 * Thin wrapper around the useAnnotations hook.
 */
export function AnnotationsProvider({
  documentId,
  children,
  initialItems,
  agent,
  role
}: AnnotationsProviderProps) {
  const ctx = useAnnotations(documentId, initialItems, agent, role);
  const editors = useEditors();

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
      <EditorsContext.Provider value={editors}>
        <SelectionContext.Provider value={selectionCtx}>
          {children}
        </SelectionContext.Provider>
      </EditorsContext.Provider>
    </Context.Provider>
  );
}
