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
   * Create or update multiple anchors
   */
  addAnchors: (anchors: NewAnchor[]) => void;
};

export const Context = createContext<AnchorsContext>({} as AnchorsContext);

/**
 * Manage a list of links between annotation bodies and their targets.
 */
export function useAnchors() {
  const { items, append, update, remove } = useListData<Anchor>({
    getKey: (item) => item.id
  });

  return useMemo<AnchorsContext>(() => {
    const getAnchor = (ref: AnchorRef): Anchor | undefined =>
      items.find(
        (a) => (ref.id === a.id) || (!ref.id && a.source === ref.source)
      );

    const addAnchors = (anchors: NewAnchor[]) => {
      anchors.forEach((a) => {
        const existing = getAnchor(a);
        if (existing) {
          // TODO: Optimize. This is a no-op.
          if (existing.id === a.id
            && existing.source === a.source
            && existing.type === a.type
            && existing.target.y === a.target.y) {
            return;
          }

          // Merge with existing anchor
          update(existing.id, {
            ...existing,
            ...a,
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

    console.log('updated anchors', items);

    return <AnchorsContext>{
      items,
      getAnchor,
      addAnchors,
    };
  }, [items, append, update, remove]);
}
