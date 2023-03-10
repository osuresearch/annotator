import { Mark } from '@tiptap/core';
import { mergeAttributes } from '@tiptap/react';

import { CommentView } from './CommentView';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    comment: {
      /**
       * Set a comment mark
       */
      setComment: (comment: string) => ReturnType;

      /**
       * Toggle a comment mark
       */
      toggleComment: () => ReturnType;

      /**
       * Unset a comment mark
       */
      unsetComment: () => ReturnType;
    };
  }
}

export interface CommentOptions {
  HTMLAttributes: Record<string, any>;
}

/**
 * Wire up a Tiptap editor to Yjs' collaboration features
 */
export const Comment = Mark.create<CommentOptions>({
  name: 'comment',

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
      },
      color: {
        default: '#bb0000',
        parseHTML: (el) => el.getAttribute('data-comment-color'),
        renderHTML: (attrs) => ({ 'data-comment-color': attrs.color })
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
    return ['comment-view', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  onCreate() {},

  addStorage() {
    return {
      users: []
    };
  },

  addCommands() {
    return {
      setComment:
        (comment: string) =>
        ({ commands }: any) =>
          commands.setMark('comment', { comment, color: 'green' }),
      toggleComment:
        () =>
        ({ commands }: any) =>
          commands.toggleMark('comment'),
      unsetComment:
        () =>
        ({ commands }: any) =>
          commands.unsetMark('comment')
    };
  }

  // addKeyboardShortcuts() {
  //   return {
  //     'Mod-z': () => this.editor.commands.undo(),
  //     'Mod-y': () => this.editor.commands.redo(),
  //     'Shift-Mod-z': () => this.editor.commands.redo(),
  //   }
  // },

  // addProseMirrorPlugins() {
  //   return [
  //     new Plugin({
  //       props: {
  //         handleClick(view, pos) {
  //           return false;
  //           const { schema, doc, tr } = view.state;

  //           const range = getMarkRange(
  //             doc.resolve(pos),
  //             schema.marks.comment
  //           );

  //           // If the user clicks within a comment mark,
  //           // update text selection to the full range
  //           if (range) {
  //             const anchor = doc.resolve(range.from);
  //             const head = doc.resolve(range.to);

  //             console.debug('Dispatch mark range', anchor, head);

  //             // realistically, we should also extract the comment id here
  //             // and fire off a custom event of some sort.

  //             view.dispatch(
  //               tr.setSelection(new TextSelection(anchor, head))
  //             );
  //             return true;
  //           }

  //           return false;
  //         },
  //     },
  //   }),
  // ];
  // },
});
