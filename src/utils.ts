import { Annotation, AnnotationReplyBody, AnnotationThreadBody, Rect } from "./types";

export function isInViewport(window: Window, rect: Rect) {
  if (!window || !document) {
    return false;
  }

  return (
    rect.y >= window.scrollY &&
    rect.x >= window.scrollX &&
    rect.y + rect.height <= window.scrollY + window.innerHeight &&
    rect.x + rect.width <= window.scrollX + window.innerWidth
  );
}

/**
 * Get the position of an element in the document relative to some parent
 */
export function getDocumentPosition(el: HTMLElement, relativeTo?: HTMLElement) {
  let left = 0;
  let top = 0;
  let current = el;

  while (current  && current !== relativeTo && !isNaN(current.offsetLeft) && !isNaN(current.offsetTop)) {
    left += current.offsetLeft - current.scrollLeft;
    top += current.offsetTop - current.scrollTop;
    current = current.offsetParent as HTMLElement;
  }

  return { top, left };
}

/**
 * Reflow all threads below (below in DOM, above in index number and top)
 * the given thread index to make room for the thread at the given index
 * and prevent overlap.
 *
 * This will cause a cascading effect to reposition all lower threads
 * if additional overlap is present. This returns the index of the first
 * thread that isn't repositioned due to overlap, or -1 if all the
 * threads below the given index had to be repositioned.
 *
 * @param index   Target thread index to reflow other threads around.
 * @param threads Thread elements, sorted by their anchor's position in the DOM.
 *
 * @returns   The index of the last element that did not require a reflow
 *            Or -1 if all elements needed to be adjusted.
 */
export function reflowBelow(index: number, threads: HTMLElement[]): number {
  // assumes sorted.

  let prevBottom = threads[index].offsetTop + threads[index].offsetHeight;

  for (let i = index + 1; i < threads.length; i++) {
    const current = threads[i];

    const top = current.offsetTop;
    const height = current.offsetHeight;

    if (top < prevBottom) {
      current.style.top = prevBottom + 'px';
      prevBottom = top + height;
    } else {
      return i;
    }
  }

  return -1;
}

export function reflowAbove(index: number, threads: HTMLElement[]): number {
  let prevTop = threads[index].offsetTop;

  for (let i = index - 1; i >= 0; i--) {
    const current = threads[i];

    const top = current.offsetTop;
    const height = current.offsetHeight;

    if (top + height > prevTop) {
      current.style.top = prevTop - height + 'px';
      prevTop = top;
    } else {
      return i;
    }
  }

  return -1;
}

/**
 * Reflow thread elements both above and below the thread at the given index.
 *
 * @param index   Target thread index to reflow other threads around.
 * @param threads Thread elements, sorted by their anchor's position in the DOM.
 */
export function reflowAround(index: number, threads: HTMLElement[]) {
  reflowBelow(index, threads);
  reflowAbove(index, threads);
}

/**
 * Reflow all thread elements based on their "best fit" positions,
 * that is, the nearest to their target anchors.
 *
 * @param threads Thread elements, sorted by their anchor's position in the DOM.
 * @param anchors Anchor elements used for referencing anchor top positions.
 */
export function reflowWithBestFit(threads: HTMLElement[], anchors: HTMLElement[]) {
  // TODO!

  // Lazy initial solution - all threads set to their anchor positions
  for (let i = 0; i < threads.length; i++) {
    threads[i].style.top = anchors[i].offsetTop + 'px';
  }
}

export function stripTags(html: string) {
  // TODO: Replace with a more reliant solution.
  if (window) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return (tmp.textContent || tmp.innerText || '').trim();
 }

 // SSR version. May not be consistent.
 return html.replace(/(<([^>]+)>)/gi, '').trim();
}

export function getTargetTextPosition(annotation: Annotation) {
  const selector = annotation.target.selector;
  if (selector?.type === 'TextPositionSelector') {
    return {
      from: selector.start,
      to: selector.end,
    }
  }

  if (selector?.type === 'FragmentSelector' && selector.refinedBy?.type === 'TextPositionSelector') {
    return {
      from: selector.refinedBy.start,
      to: selector.refinedBy.end,
    }
  }

  // It's a selector that doesn't specify a range.
  // Let's just stick it at the beginning of the text.
  return {
    from: 0,
    to: 0,
  }
}

export function filterAnnotations(
  annotations: Annotation[],
  source: string,
  includeDeleted: boolean,
  includeResolved: boolean
): Annotation[] {
  return annotations.filter((t) => {
    // Make sure the annotation is targeting the field.
    const selector = t.target.selector;
    if (selector?.type !== 'FragmentSelector' || selector.value !== source) {
      return false;
    }

    const thread = t.body.find((b) => b.type === 'Thread') as AnnotationThreadBody | undefined;
    const reply = t.body.find((b) => b.type === 'ThreadReply') as AnnotationReplyBody | undefined;

    if (!includeDeleted && thread?.deleted || reply?.deleted) {
      return false;
    }

    if (!includeResolved && thread?.resolved) {
      return false;
    }

    return true;
  });
}
