import { Mark } from '@tiptap/core';
import { mergeAttributes } from '@tiptap/react';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    commentFocus: {
      /**
       * Set a comment focus mark
       */
      setCommentFocus: (comment: string) => ReturnType;

      /**
       * Toggle a comment focus mark
       */
      toggleCommentFocus: () => ReturnType;

      /**
       * Unset a comment focus mark
       */
      unsetCommentFocus: () => ReturnType;
    };
  }
}

export interface CommentFocusOptions {
  HTMLAttributes: Record<string, any>;
}

/**
 * Tiptap mark extension that handles highlighting the current focused comment.
 *
 * Since comment marks can be merged when multiple comments overlap, we use
 * a separate focus mark to indicate which subsection is the actual context.
 */
export const CommentFocus = Mark.create<CommentFocusOptions>({
  name: 'comment-focus',

  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },

  addAttributes() {
    return {
      comment: {
        default: null,
        parseHTML: (el) => el.getAttribute('data-comment'),
        renderHTML: (attrs) => ({ 'data-comment': attrs.comment })
      }
    };
  },

  parseHTML() {
    // Apply this mark back to existing comments in the DOM
    return [
      {
        tag: 'comment-view[data-comment]',
        getAttrs: (el: any) => !!el.getAttribute('data-comment')?.trim() && null
      }
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['comment-focus-view', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setCommentFocus:
        (comment: string) =>
        ({ commands }: any) =>
          commands.setMark('comment-focus', { comment }),
      toggleCommentFocus:
        () =>
        ({ commands }: any) =>
          commands.toggleMark('comment-focus'),
      unsetCommentFocus:
        () =>
        ({ commands }: any) =>
          commands.unsetMark('comment-focus')
    };
  }
});
