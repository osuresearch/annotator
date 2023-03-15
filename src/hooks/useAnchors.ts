import { createContext, useMemo } from 'react';
import { useListData } from 'react-stately';
import { getDocumentPosition } from '../utils';
import { v4 as uuidv4 } from 'uuid';

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
    target?: HTMLElement,
    links?: HTMLElement[]
  ) => void;

  /**
   * Update the target element of an anchor.
   *
   * If the anchor does not exist yet in the list, this
   * will also add a new anchor instance with a matching
   * source + annotationId.
   */
  // setTarget: (ref: AnchorRef, target: HTMLElement) => void;

  /**
   * Attach a body element to an anchor.
   *
   * If the anchor does not exist yet in the list, this
   * will also add a new anchor instance with a matching
   * source + annotationId.
   */
  link: (ref: AnchorRef, el: HTMLElement) => void;

  /**
   * Remove a body element from an anchor
   */
  unlink: (ref: AnchorRef, el: HTMLElement) => void;

  getAnchorTop: (ref: AnchorRef) => number;

  reflow: () => void;
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
      target?: HTMLElement,
      links: HTMLElement[] = []
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
        annotationId,
        links
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

            // Merge links
            links: [...existing.links, ...a.links]
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

    return {
      items,
      getAnchor,
      setAnchor,
      addAnchors,

      link: (ref: AnchorRef, el: HTMLElement) => {
        const existing = getAnchor(ref);
        if (!existing) {
          console.log('link with add', el, ref);
          append({
            id: uuidv4(),
            ...ref,
            target: undefined,
            links: [el]
          });
          return;
        }

        console.log('link', el, ref);
        update(existing.id, {
          ...existing,
          links: [...existing.links.filter((e) => e !== el), el]
        });
      },
      unlink: (ref: AnchorRef, el: HTMLElement) => {
        const existing = getAnchor(ref);
        if (!existing) {
          console.warn('missing anchor for unlink, ignoring', el, ref);
          return;
        }

        console.log('unlink', el, ref);

        update(existing.id, {
          ...existing,
          links: existing.links.filter((e) => e !== el)
        });
      },
      getAnchorTop: (ref: AnchorRef) => {
        let match = getAnchor(ref);
        // If we can't find an exact match, fallback to trying
        // for an anchor to the source in general (next best thing)
        if (!match) {
          match = getAnchor({
            source: ref.source
          });
        }

        if (!match || !match.target) {
          return -1;
        }

        return match.target.offsetTop;
      },

      // probably pass in a focus as well to flow around.
      reflow: () => {
        console.log('flow');

        // maybe some sort of DOM monitoring.. scheme?

        items.forEach((item) => {
          if (!item.target) {
            // can't position
            item.links.forEach((el) => {
              el.style.border = '4px solid red';
            });
            return;
          }

          const pos = getDocumentPosition(item.target);
          console.log(item, pos);

          item.links.forEach((el) => {
            el.style.border = '4px solid green';
            el.style.top = pos.top - 35 + 'px';
            el.style.position = 'absolute';
          });
        });
      }
    };
  }, [items, append, update, remove]);
}
