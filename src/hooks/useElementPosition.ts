import { useMemo, useState, useRef, useEffect } from 'react';
import { getDocumentPosition } from '../utils';

/**
 * Monitor for position changes of an element.
 *
 * This takes in account both size changes and document-relative
 * position changes.
 */
export function useElementPosition(ref?: HTMLElement) {
  const [rect, setRect] = useState<Rect>(() => {
    if (ref) {
      const position = getDocumentPosition(ref);
      return {
        x: Math.round(position.left),
        y: Math.round(position.top),
        width: Math.round(ref.clientWidth),
        height: Math.round(ref.clientHeight),
      }
    }

    return { x: 0, y: 0, width: 0, height: 0 }
  });

  // TODO: Obviously, performance isn't great here. But
  // ResizeObserver isn't sufficient. Any modern solutions?
  useEffect(() => {
    if (!ref) {
      return;
    }

    let prev = rect; // Rect = { x: 0, y: 0, width: 0, height: 0 }

    const handle = setInterval(() => {
      const position = getDocumentPosition(ref);
      const r: Rect = {
        x: Math.round(position.left),
        y: Math.round(position.top),
        width: Math.round(ref.clientWidth),
        height: Math.round(ref.clientHeight),
      }

      if (r.x !== prev.x || r.y !== prev.y || r.width !== prev.width || r.height !== prev.height) {
        console.log('POSITION', r, prev);
        prev = r;
        setRect(r);
      }
    }, 1000);

    return () => clearInterval(handle);
  }, [ref]);

  return rect;
}
