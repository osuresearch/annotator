import { createContext, useContext } from 'react';

export type AnnotationSelection = {
  source: string;
  type: RUIAnnoSubtype;
  top: number;
  start?: number;
  end?: number;
};

export type AnnotationPickerContext = {
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

export const Context = createContext<AnnotationPickerContext>({} as AnnotationPickerContext);

export type useAnnotationPickerReturn = AnnotationPickerContext;

export function useAnnotationPicker(): useAnnotationPickerReturn {
  const ctx = useContext(Context);
  return ctx;
}
