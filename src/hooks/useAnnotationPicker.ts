import { createContext, useContext } from 'react';

export type AnnotationSelection = {
  /**
   * Field to be annotated within the document
   */
  targetField: string;

  type: 'highlight' | 'note' | 'tmp';

  top: number;

  start?: number;
  end?: number;
};

export interface IAnnotationPickerContext {
  /**
   * Select a new region of the document to annotate
   */
  select: (selection?: AnnotationSelection) => void;

  /**
   * Currently selected region of the document, if available
   */
  selected?: AnnotationSelection;

  /**
   * Remove the current selection
   */
  deselect: () => void;
};

export const AnnotationPickerContext = createContext<IAnnotationPickerContext>({} as IAnnotationPickerContext);

export type useAnnotationPickerReturn = IAnnotationPickerContext;

export function useAnnotationPicker(): useAnnotationPickerReturn {
  const ctx = useContext(AnnotationPickerContext);
  return ctx;
}
