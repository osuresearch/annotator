import { createContext, useMemo } from 'react';
import { useListData } from 'react-stately';
import { getDocumentPosition } from '../utils';
import { v4 as uuidv4 } from 'uuid';
import { UseAnchorsContextReturn } from './useAnchorsContext';

export type AnchorsContext = {
  /**
   * Current anchors in the document.
   *
   * Sort order is not guaranteed.
   */
  items: Anchor[];

  /**
   * Find an anchor by source and annotation ID
   */
  getAnchor: (ref: AnchorRef) => Anchor | undefined;

  /**
   * Create or update an existing anchor
   */
  // addAnchor: (anchor: Anchor) => void;

  /**
   * Create or update multiple anchors
   */
  addAnchors: (anchors: NewAnchor[]) => void;

  setAnchor: (
    source: string,
    type: RUIAnnoSubtype,
    annotationId?: AnnotationID,
    target?: HTMLElement
  ) => void;
};

export const Context = createContext<AnchorsContext>({} as AnchorsContext);

export function useAnchors() {
  const { items, append, update, remove } = useListData<Anchor>({
    getKey: (item) => item.id
  });

  return useMemo<AnchorsContext>(() => {
    const getAnchor = (ref: AnchorRef): Anchor | undefined =>
      items.find(
        (a) => a.source === ref.source && a.annotationId === ref.annotationId
        // && (!ref.type || a.type === ref.type)
      );

    const setAnchor = (
      source: string,
      type: RUIAnnoSubtype,
      annotationId?: AnnotationID,
      target?: HTMLElement
    ) => {
      const existing = getAnchor({ source, annotationId });
      if (existing) {
        update(existing.id, {
          ...existing,
          target
        });
        return;
      }

      append({
        id: uuidv4(),
        type,
        source,
        target,
        annotationId
      });
    };

    const addAnchors = (anchors: NewAnchor[]) => {
      anchors.forEach((a) => {
        const existing = getAnchor(a);
        if (existing) {
          // Merge with existing anchor
          update(existing.id, {
            ...existing,

            // Fallback to existing target
            target: a.target ?? existing.target,
          });
          return;
        }

        // Add new anchor
        append({
          ...a,
          id: a.id ?? uuidv4()
        });
      });
    };

    return <AnchorsContext>{
      items,
      getAnchor,
      setAnchor,
      addAnchors,
    };
  }, [items, append, update, remove]);
}
