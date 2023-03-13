import { useEffect, useState } from 'react';
import { useAnnotationsContext } from './useAnnotationsContext';

export type UseThreadsReturn = {
  /**
   * Annotation threads associated with the named field
   */
  threads: Annotation[];

  /**
   * Does one of the threads associated with the named
   * field have the user's focus?
   */
  isFocused: boolean;

  focus: (thread: Annotation) => void;

  /**
   * Add a new thread to this field and focus it
   */
  create: (motivation: AnnotationMotivation, selector?: AnnotationSelector) => Annotation;
};

/**
 * Interact with threads associated with the given field.
 *
 * TODO: Instance handling.
 *
 * @param name              Field name to use when locating associated threads
 * @param includeResolved   Should threads that are resolved also be included in the
 *                          returned list of tracked threads
 */
export function useThreads(source: string, includeResolved = false): UseThreadsReturn {
  const { annotations, focused, createThread, focus } = useAnnotationsContext();

  const [threads, setThreads] = useState<Annotation[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const visible = annotations.filter((t) => {
      if (t.target.source !== source) {
        return false;
      }

      const { deleted, resolved } = t.body.find((b) => b.type === 'Thread') as AnnotationThreadBody;

      return !deleted && (!resolved || includeResolved);
    });

    // Update our thread state array IFF there's changes to the tracked threads.
    // NOTE: This doesn't account for order. We assume they're already sorted.
    if (threads.length !== visible.length || !threads.every((t, i) => t.id === visible[i].id)) {
      setThreads(visible);
    }
  }, [annotations, source, threads, includeResolved]);

  useEffect(() => {
    setIsFocused(!!focused && threads.findIndex((t) => t.id === focused.id) >= 0);
  }, [threads, focused]);

  return {
    threads,
    isFocused,
    create: (motivation, selector) => createThread(source, motivation, selector),
    focus: (thread) => focus(thread.id)
  };
}
