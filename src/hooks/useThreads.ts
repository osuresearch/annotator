import { useEffect, useMemo, useState } from 'react';
import { Annotation, AnnotationMotivation, AnnotationSelector, AnnotationThreadBody } from '../types';
import { useAnnotationsContext } from './useAnnotationsContext';

export type UseThreadsReturn = {
  /**
   * Annotation threads associated with the source
   */
  threads: Annotation[];

  /**
   * Does one of the threads associated with the
   * source have the user's focus?
   */
  isFocused: boolean;

  focus: (thread: Annotation) => void;

  /**
   * Focus the next thread associated with this source
   */
  focusNext: () => void;

  /**
   * Add a new annotation thread to this source and focus it
   */
  create: (motivation: AnnotationMotivation, selector?: AnnotationSelector) => Annotation;
};

/**
 * Interact with all threads associated with the given document and source.
 *
 * @param source            Source name within the document to use when locating associated threads
 * @param includeResolved   Should threads that are resolved also be included in the
 *                          returned list of tracked threads
 */
export function useThreads(source: string, includeResolved = false): UseThreadsReturn {
  const { annotations, focused, createThread, focus } = useAnnotationsContext();

  const [threads, setThreads] = useState<Annotation[]>([]);

  useEffect(() => {
    const visible = annotations.filter((t) => {
      // Make sure the annotation is targeting this source field.
      const selector = t.target.selector;
      if (selector?.type !== 'FragmentSelector' || selector.value !== source) {
        return false;
      }

      // Make sure the thread hasn't been deleted or resolved
      const { deleted, resolved } = t.body.find((b) => b.type === 'Thread') as AnnotationThreadBody;

      return !deleted && (!resolved || includeResolved);
    });

    // Update our thread state array IFF there's changes to the tracked threads.
    // NOTE: This doesn't account for order. We assume they're already sorted.
    if (threads.length !== visible.length || !threads.every((t, i) => t.id === visible[i].id)) {
      setThreads(visible);
    }
  }, [annotations, source, threads, includeResolved]);

  const isFocused = !!focused && threads.findIndex((t) => t.id === focused.id) >= 0;

  return {
    threads,
    isFocused,
    create: (motivation, selector) => createThread(motivation, selector),
    focus: (thread) => focus(thread.id),
    focusNext: () => {
      if (threads.length < 1) {
        return;
      }

      // Focus next thread in the list.
      // TODO: Is this sorted in some way? Don't think so.
      if (!isFocused || focused) {
        for (let i = 0; i < threads.length; i++) {
          if (threads[i].id === focused?.id && i < threads.length - 1) {
            focus(threads[i + 1].id);
            return;
          }
        }
      }

      // Otherwise, cycle back to focus the first thread.
      focus(threads[0].id);
    }
  };
}
