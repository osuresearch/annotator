import { Editor } from "@tiptap/react";
import { useEffect, useRef } from "react";
import { Annotation, AnnotationThreadBody, NewAnchor } from '../types';
import { getDocumentPosition, getTargetTextPosition } from "../utils";
import { useAnchorsContext } from "./useAnchorsContext";

/**
 * Add comment marks and comment focus marks to the Tiptap content to
 * indicate which ranges of text are associated with the annotations
 * and focused annotation (respectively).
 *
 * @param editor
 * @param annotations The annotated text ranges will get a `comment` mark applied.
 * @param focused     The focused annotation text range, if specified, will get
 *                    a `comment-focus` mark applied.
 */
export function useTiptapAnnotations(source: string, editor: Editor | null, annotations: Annotation[], focused?: Annotation) {
  const annotationCount = useRef(0);
  const focusId = useRef<string|undefined>(undefined);
  const { addAnchors } = useAnchorsContext();

  useEffect(() => {
    if (!editor) {
      return;
    }

    const redrawMarks = () => {
      // Remove all comment marks
      const commands = editor.chain().selectAll().unsetComment().unsetCommentFocus();

      // Re-apply comment marks for the annotations.
      // We don't mark deleted or resolved annotations.
      annotations.forEach((t) => {
        if (!t.body) {
          console.error(t);
          return;
        }
        const { deleted, resolved } = t.body.find((b) => b.type === 'Thread') as AnnotationThreadBody;

        if (!deleted && !resolved) {
          commands
            .setTextSelection(getTargetTextPosition(t))
            .setComment(t.id);
        }
      });

      // If we have a focused thread as well, draw a mark for it.
      if (focused) {
        const { deleted } = focused.body.find((b) => b.type === 'Thread') as AnnotationThreadBody;

        if (!deleted) {
          commands
            .setTextSelection(getTargetTextPosition(focused))
            .setCommentFocus(focused.id)
        }
      };

      // Reset selection and run batch
      commands.setTextSelection(0).run();

      // Operating outside React, we need to update our list of anchors
      // associated with this particular editor via DOM traversal.

      // TODO: This is horribly inefficient. Every time the editor's content
      // changes (comment marks are added/removed/focused) we have to scan
      // it for comment-view elements and send them over as dynamic anchors.
      // Has to be a special anchor type as well otherwise the Controller will
      // decide to render them out, which conflicts with a wrapping anchor
      // (usually a 'highlight' target).

      // addAnchors() does check for duplicates and doesn't update state
      // if it finds one, but there has to be a more efficient solution.

      const anchors: NewAnchor[] = [];
      editor.view.dom.querySelectorAll<HTMLElement>('comment-view').forEach((el) => {
        const pos = getDocumentPosition(el);
        anchors.push({
          id: el.dataset.comment,
          type: 'tmp',
          source,
          target: {
            x: pos.left,
            y: pos.top,
            width: 0, height: 0
          },
        });
      });

      console.log('new anchors', anchors);

      addAnchors(anchors);
    }

    // Determine if we need to recompute marks. We use a ref
    // counter to check if any annotations have been added/removed
    // since the last redraw and a toggle for focus state.

    // TODO:
    // This does NOT account for updating annotated ranges
    // in existing annotations or batch adding/removing in one call.

    if (annotations.length !== annotationCount.current) {
      annotationCount.current = annotations.length;
      redrawMarks();
      return;
    }

    // Focused mark changed, redraw the mark(s)
    if (focusId.current !== focused?.id) {
      focusId.current = focused?.id;
      redrawMarks();
    }
  }, [editor, annotations, annotationCount, focusId, focused, addAnchors]);
}
