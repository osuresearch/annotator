import React, { forwardRef, useEffect, useRef, useState } from 'react';

import { FocusScope, useFocusRing } from 'react-aria';
import { useEditor, EditorContent } from '@tiptap/react';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { useFrame } from 'react-frame-component';

import { useAnnotationsContext } from '../../hooks/useAnnotationsContext';
import { useTiptapAnnotations } from '../../hooks/useTiptapAnnotations';
import { ActionsPopover } from '../ActionsPopover';
import { isInViewport } from '../../utils';
import { useAnnotationPicker } from '../../hooks/useAnnotationPicker';

import { Comment } from './comment';
import { CommentFocus } from './comment-focus';

type ActiveMark = Rect & {
  id: string;
};

/**
 * Utility to retrieve all comment-views present with a thread reference
 *
 * @param editor
 */
function getCurrentThreadIDs(editor: Editor): Set<AnnotationID> {
  // The ProseEditor way of navigating the node tree is a bit complex
  // (see: https://discuss.prosemirror.net/t/best-method-for-collecting-all-marks-in-a-block/2883)

  // Instead, we just rely on DOM queries to simplify things.
  // If this doesn't scale in the future, look into Node-based iteration.

  const views = editor.view.dom.querySelectorAll<HTMLElement>('comment-view');
  const ids = new Set<AnnotationID>();
  views.forEach((el) => el.dataset.comment && ids.add(el.dataset.comment));

  return ids;
}

function rectAtPos(window: Window, editor: Editor, from: number): Rect {
  const pos = editor.view.coordsAtPos(from);
  return {
    x: pos.left,
    y: pos.top + window.scrollY,
    width: 0,
    height: pos.bottom - pos.top
  };
}

export type AnnotatedTextFieldProps = {
  name: string;
  content: string;
};

/**
 * A reviewable element can contain multiple selection ranges,
 * each tied to a comment thread.
 *
 * New threads can be added created by selecting new ranges,
 * and clicking a range associated with a thread will focus
 * that thread for the user to interact with.
 *
 * TODO: Break this component down more. Anchor is a good candidate for some of this
 * (at least the positioning pieces)
 *
 * NOTE: Don't need forwardRef anymore
 */
export const AnnotatedTextField = forwardRef<HTMLDivElement, AnnotatedTextFieldProps>(({ name, content }, ref) => {
  const { window } = useFrame();
  const { select } = useAnnotationPicker();

  // Global context for the entire document for thread management
  const { annotations, focused, focus } = useAnnotationsContext();

  // Filter down to only annotations we care about.
  // TODO(perf): Scaling issue with too many annotations.
  const trackedAnnotations = annotations.filter((t) => t.target.source === name);

  const checkForUpdatedSelection = ({ editor }: { editor: Editor }) => {
    const { from, to, empty, $from, $head, $anchor } = editor.state.selection;
    const mark = editor.isActive('comment');
    const focusMark = editor.isActive('comment-focus');

    // Ignore - we clicked something that already had focus
    if (focusMark) {
      return;
    }

    // Update global anchor information to our selection range.
    // This will help us position comments / popovers later
    if (!empty && to - from > 1) {
      const fromPos = editor.view.coordsAtPos(from);
      select({
        source: name,
        type: 'highlight',
        top: fromPos.top + (window?.scrollY ?? 0),
        start: from,
        end: to,
      });

      return;
    }

    // If we click inside a comment mark, it takes selection priority.
    if (mark && editor.isFocused) {
      const id = editor.getAttributes('comment').comment;
      focus(id);
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false
      }),

      Comment.configure({}),

      CommentFocus.configure({})
    ],

    onSelectionUpdate: checkForUpdatedSelection,

    editorProps: {
      attributes: {
        spellcheck: 'false',
        tabindex: '0'
      }
    },

    content,
    editable: false
  });

  useTiptapAnnotations(
    name,
    editor,
    trackedAnnotations,
    focused?.target.source === name
      ? focused
      : undefined
  );

  return (
    <div ref={ref}>
      <EditorContent editor={editor} />
    </div>
  );
});
