import { Extension } from '@tiptap/core';
import { redo, undo, yCursorPlugin, ySyncPlugin, yUndoPlugin, yUndoPluginKey } from 'y-prosemirror';
import { UndoManager } from 'yjs';

// Via https://tiptap.dev/api/extensions/collaboration but needs to be refactored a bit.
// Also theirs is a "Pro" plugin, despite being a thin wrapper over y-prosemirror.
export interface CollaborationOptions {
  /**
   * An initialized Y.js document.
   */
  document: any;
  /**
   * Name of a Y.js fragment, can be changed to sync multiple fields with one Y.js document.
   */
  field: string;

  user: any;

  provider: any;

  /**
   * A raw Y.js fragment, can be used instead of `document` and `field`.
   */
  fragment: any;
}

const awarenessStatesToArray = (states: Map<number, Record<string, any>>) =>
  Array.from(states.entries()).map(([key, value]) => ({
    clientId: key,
    ...value.user
  }));

/**
 * Wire up a Tiptap editor to Yjs' collaboration features
 */
export const Collaboration = Extension.create<CollaborationOptions>({
  name: 'collaboration',

  priority: 1000,

  addOptions() {
    return {
      document: null,
      provider: null,
      field: 'default',
      fragment: null,
      user: {
        name: null,
        color: null
      },
      render: (user: any) => {
        const cursor = document.createElement('span');

        cursor.classList.add('collaboration-cursor__caret');
        cursor.setAttribute('style', `border-color: ${user.color}`);

        const label = document.createElement('div');

        label.classList.add('collaboration-cursor__label');
        label.setAttribute('style', `background-color: ${user.color}`);
        label.insertBefore(document.createTextNode(user.name), null);
        cursor.insertBefore(label, null);

        return cursor;
      },
      onUpdate: () => null
    };
  },

  onCreate() {},

  addStorage() {
    return {
      users: []
    };
  },

  addCommands() {
    return {
      undo:
        () =>
        ({ tr, state, dispatch }: any) => {
          tr.setMeta('preventDispatch', true);

          const undoManager: UndoManager = yUndoPluginKey.getState(state).undoManager;

          if (undoManager.undoStack.length === 0) {
            return false;
          }

          if (!dispatch) {
            return true;
          }

          return undo(state);
        },
      redo:
        () =>
        ({ tr, state, dispatch }: any) => {
          tr.setMeta('preventDispatch', true);

          const undoManager: UndoManager = yUndoPluginKey.getState(state).undoManager;

          if (undoManager.redoStack.length === 0) {
            return false;
          }

          if (!dispatch) {
            return true;
          }

          return redo(state);
        },
      updateUser: (attributes: any) => () => {
        this.options.user = attributes;

        this.options.provider.awareness.setLocalStateField('user', this.options.user);

        return true;
      }
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-z': () => this.editor.commands.undo(),
      'Mod-y': () => this.editor.commands.redo(),
      'Shift-Mod-z': () => this.editor.commands.redo()
    };
  },

  addProseMirrorPlugins() {
    const fragment = this.options.fragment
      ? this.options.fragment
      : this.options.document.getXmlFragment(this.options.field);

    return [
      ySyncPlugin(fragment),
      yUndoPlugin(),
      yCursorPlugin(
        (() => {
          const awareness = this.options.provider.awareness;
          awareness.setLocalStateField('user', this.options.user);

          this.storage.users = awarenessStatesToArray(awareness.states);

          awareness.on('update', () => {
            this.storage.users = awarenessStatesToArray(awareness.states);
          });

          return awareness;
        })(),
        {
          cursorBuilder: this.options.render
        }
      )
    ];
  }
});
