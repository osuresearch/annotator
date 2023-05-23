import { createContext, useMemo, useRef } from 'react';
import { useListData } from 'react-stately';
import { Anchor, AnchorRef, NewAnchor } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { useList } from 'react-use';

export type IAnchorsContext = {
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

  /**
   * Remove an anchor by ID
   */
  removeAnchor: (id: string) => void;

  clearAnchors: () => void;

  /**
   * Container that anchors are relative to.
   *
   * This helps positioning threads and markers.
   */
  ref: React.RefObject<HTMLDivElement>;
};

export const AnchorsContext = createContext<IAnchorsContext>({} as IAnchorsContext);

/**
 * Manage a list of links between annotation bodies and their targets.
 */
export function useAnchors(): IAnchorsContext {
  // const [items, setItems] = useState<Anchor[]>([]);
  const [list, { set, push, updateAt, insertAt, update, updateFirst, upsert, sort, filter, removeAt, clear, reset }] = useList<Anchor>([]);

  const ref = useRef<HTMLDivElement>(null);


  // const { items, append, update, remove } = useListData<Anchor>({
  //   getKey: (item) => item.id
  // });

  const getAnchor = (ref: AnchorRef): Anchor | undefined =>
    list.find(
      (a) => (ref.id === a.id) || (!ref.id && a.source === ref.source)
    );

  const addAnchors = (anchors: NewAnchor[]) => {
    anchors.forEach((a) => {

      upsert((e) => e.id === a.id, {
        ...a,
        id: a.id ?? 'APPEND-' + uuidv4()
      });
      return;

      const idx = list.findIndex(
        (e) => (a.id === e.id) || (!a.id && e.source === a.source)
      );

      if (idx >= 0) {
        const existing = list[idx];

        // TODO: Optimize. This is a no-op because
        // we haven't changed any of the data yet.
        if (existing.id === a.id
          && existing.source === a.source
          && existing.type === a.type
          && existing.target.y === a.target.y
        ) {
          return;
        }

        console.log('update anchor', existing);

        update((e) => e.id === a.id, {
          ...existing,
          ...a
        });

        return;
      }

      console.log('append anchor', a);

      push({
        ...a,
        id: a.id ?? 'APPEND-' + uuidv4()
      });
    });
  };

  const removeAnchor = (id: string) => {
    console.log('remove', id);
    filter((a) => a.id !== a.id);
  }

  const clearAnchors = () => {
    console.warn('clearing', list);
    clear();
  }

  console.log('updated anchors', list);

  return {
    ref,
    items: list,
    getAnchor,
    addAnchors,
    removeAnchor,
    clearAnchors
  };
}
