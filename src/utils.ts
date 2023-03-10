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

// function sortThreads(threads: HTMLElement[], anchors: HTMLElement[]): HTMLElement[] {
//   // sort anchors by top and then re-map the sorted indices back to threads.

// }

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
