import { createContext, useMemo } from 'react';
import { useListData } from 'react-stately';
import { v4 as uuidv4 } from 'uuid';

export type AnchorsContext = {
  items: Anchor[];
  getAnchor: (source: string, annotationId?: AnnotationID) => Anchor | undefined;
  setAnchor: (
    el: HTMLElement,
    source: string,
    type: RUIAnnoSubtype,
    annotationId?: AnnotationID
  ) => void;
  addAnchors: (anchors: Anchor[]) => void;

  link: (id: string, el: HTMLElement) => void;
  unlink: (id: string, el: HTMLElement) => void;

  // upsertAnchor: (anchor: Anchor) => void;

  getAnchorTop: (source: string, annotationId?: AnnotationID) => number;
};

export const Context = createContext<AnchorsContext>({} as AnchorsContext);

export function useAnchors() {
  const { items, append, update, remove } = useListData<Anchor>({
    getKey: (item) => item.id
  });

  return useMemo<AnchorsContext>(() => {
    const getAnchor = (source: string, annotationId?: AnnotationID): Anchor | undefined =>
      items.find((a) => a.source === source && a.annotationId === annotationId);

    const setAnchor = (
      el: HTMLElement,
      source: string,
      type: RUIAnnoSubtype,
      annotationId?: AnnotationID
    ) => {
      const existing = getAnchor(source, annotationId);
      if (existing) {
        update(existing.id, {
          ...existing,
          el
        });
      } else {
        // TODO: Ordered insert.
        append({
          id: uuidv4(),
          type,
          source,
          el,
          annotationId
        });
      }
    };

    const addAnchors = (anchors: Anchor[]) => {
      // TODO: Ordered insert and replace
      remove(...items.map((item) => item.id));

      console.log('add anchors', anchors);
      append(...anchors);
    };

    return {
      items,
      getAnchor,
      setAnchor,
      addAnchors,

      link: (id: string, el: HTMLElement) => {
        console.log('link', id, el);
      },
      unlink: (id: string, el: HTMLElement) => {
        console.log('unlink', id, el);
      },

      getAnchorTop: (source: string, annotationId?: AnnotationID) => {
        let match = getAnchor(source, annotationId);
        if (!match) {
          match = getAnchor(source);
        }

        if (!match) {
          return -1;
        }

        return match.el.offsetTop;
      }
    };
  }, [items, append, update, remove]);
}
