import { useEffect, useMemo, useState } from 'react';
import { useAnnotationsContext } from './useAnnotationsContext';

export type UseThreadReturn = {
  thread?: Annotation;
  focused: boolean;

  /**
   * Current replies to this thread
   */
  replies: Annotation[];

  /** Focus the thread in the UI */
  focus: () => void;

  /** Update the main comment on the thread */
  updateComment: (message: string) => void;

  /** Remove (delete) the thread */
  remove: (recoverable?: boolean) => void;

  /** Undo a previously removed thread */
  recover: () => void;

  /** Resolve the thread as complete */
  resolve: () => void;

  /** Unresolve the previously resolved thread */
  reopen: () => void;

  /** Add a reply to the thread */
  addReply: (message: string) => Annotation;

  updateReply: (id: AnnotationID, message: string) => void;

  removeReply: (id: AnnotationID, recoverable?: boolean) => void;

  recoverReply: (id: AnnotationID) => void;
};

export function useThread(id: AnnotationID): UseThreadReturn {
  const { annotations, createThread, createReply, updateBody, focused, patch, focus } =
    useAnnotationsContext();

  const [thread, setThread] = useState<Annotation>();
  const [replies, setReplies] = useState<Annotation[]>([]);

  // If the thread list updates, check if the monitored
  // thread needs to be updated due to reference/data change
  useEffect(() => {
    const match = annotations.find((t) => t.id === id);

    // Reference change (thus data change)
    if (match && match !== thread) {
      setThread(match);
    }

    // TODO: This updates constantly whenever other annotations change.
    // How do we only update this when the individual replies change?
    const replies = annotations.filter((a) => a.target.source === id);
    setReplies(replies);

    console.log('useThread effect ', id);
  }, [annotations]);

  return useMemo<UseThreadReturn>(
    () => ({
      thread,
      focused: focused?.id === id,
      replies,
      focus: () => {
        thread && focus(thread.id);
      },

      updateComment: (message: string) => {
        thread &&
          updateBody('TextualBody', thread.id, (prev) => ({
            ...prev,
            value: message
          }));
      },

      remove: (recoverable = true) => {
        thread &&
          updateBody('RippleThread', thread.id, (prev) => ({
            ...prev,
            deleted: true,
            recoverable
          }));
      },

      recover: () => {
        thread &&
          updateBody('RippleThread', thread.id, (prev) => ({
            ...prev,
            deleted: false
          }));
      },

      resolve: () => {
        thread &&
          updateBody('RippleThread', thread.id, (prev) => ({
            ...prev,
            resolved: true
          }));
      },

      reopen: () => {
        thread &&
          updateBody('RippleThread', thread.id, (prev) => ({
            ...prev,
            resolved: false
          }));
      },

      addReply: (message: string) => {
        if (!thread) {
          throw new Error('Invalid thread');
        }

        const reply = createReply(thread.id, message);

        // Tap the main thread to trigger a re-render and update
        // any metadata that we need to update at the thread level.
        updateBody('RippleThread', thread.id, (prev) => ({
          ...prev
        }));

        return reply;
      },

      updateReply: (id: AnnotationID, message: string) => {
        if (replies.findIndex((r) => r.id === id) < 0) {
          throw new Error(
            `Could not update reply: annotation ${id} is not a reply to ${thread?.id}`
          );
        }

        updateBody('TextualBody', id, (prev) => ({
          ...prev,
          value: message
        }));
      },

      removeReply: (id: AnnotationID, recoverable = true) => {
        if (replies.findIndex((r) => r.id === id) < 0) {
          throw new Error(
            `Could not remove reply: annotation ${id} is not a reply to ${thread?.id}`
          );
        }

        updateBody('RippleReply', id, (prev) => ({
          ...prev,
          deleted: true,
          recoverable
        }));
      },

      recoverReply: (id: AnnotationID) => {
        if (replies.findIndex((r) => r.id === id) < 0) {
          throw new Error(
            `Could not recover reply: annotation ${id} is not a reply to ${thread?.id}`
          );
        }

        updateBody('RippleReply', id, (prev) => ({
          ...prev,
          deleted: false
        }));
      }
    }),
    [thread, replies, patch, focus]
  );
}
