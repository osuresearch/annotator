import {
  Box,
  Button,
  Code,
  FocusRing,
  FormField,
  Item,
  LookupField,
  LookupFieldProps
} from '@osuresearch/ui';
import React, { useRef, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useTextField } from 'react-aria';

import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';

import { BaseFieldProps } from '../../react/types';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Collaboration } from './collab';
import { ydoc, provider as rtcProvider } from '../../yjs';
import { WebrtcProvider } from 'y-webrtc';

import './collab-cursor.css';
import './comment.css';
import { Comment } from './comment';
import { Editor } from '@tiptap/core';
import { useAnnotationsContext } from '../../hooks/useAnnotationsContext';

import CommentView from './comment-view';

export type TextEditorProps = BaseFieldProps<string> & {
  limit?: number;
};

// TODO: Rename to TextField or RichtextField
export function TextEditor({ limit = 1000, ...props }: TextEditorProps) {
  const [provider, setProvider] = useState<WebrtcProvider>();
  const { focus, clearFocus, createThread } = useAnnotationsContext();

  const { name, onChange, onBlur, value } = props;

  useEffect(() => {
    setProvider(rtcProvider);
  }, []);

  const extensions = provider
    ? [
        // Placeholder.configure({
        //   placeholder: 'Start typing...'
        // }),

        StarterKit.configure({
          history: false
        }),

        Collaboration.configure({
          document: ydoc,
          provider,
          field: name + '-tiptap',
          user: { color: '#3daee9', name: 'John Doe' }
        }),

        CharacterCount.configure({
          limit
        }),

        Comment.configure({}),

        CommentView
      ]
    : [Placeholder.configure({ placeholder: 'Loading...' }), StarterKit];

  // I need a node, not the field to register while it's already registered.

  const editor = useEditor(
    {
      extensions,

      // Sync up when the user types
      // TODO: Throttle this a bit. Or on the yjs side.
      onUpdate: ({ editor }) => {
        if (onChange) {
          onChange(editor.getHTML());
        }
      },

      onSelectionUpdate: ({ editor }) => {
        console.log('update selection');
        checkForClickedComment(editor);
        checkForUpdatedSelection(editor);
      },

      onBlur({ editor }) {
        setIsTextSelected(false);

        // TODO: onBlur support.
        if (onChange) {
          onChange(editor.getHTML());
        }
      },

      editorProps: {
        attributes: {
          // Spellcheck breaks when we have remote users highlighting
          // sections of words, or a word is broken with a comment span.
          spellcheck: 'false'
        }
      }
    },
    [provider]
  );

  const [isTextSelected, setIsTextSelected] = React.useState(false);

  // Highlight and scroll the comment into view on the sidebar
  const focusActiveComment = (editor: Editor) => {
    console.log('activate comment', editor.getAttributes('comment'));

    const id = editor.getAttributes('comment').comment;
    focus(id);
  };

  const checkForUpdatedSelection = (editor: Editor) => {
    setIsTextSelected(!editor.state.selection.empty);
  };

  const checkForClickedComment = (editor: Editor) => {
    const mark = editor.isActive('comment');

    // If they clicked on an existing comment mark, activate it
    if (mark) {
      focusActiveComment(editor);
      return;
    }

    // They clicked outside of comment marks, clear focus
    clearFocus();

    // If they have text selected, prompt them to add a comment
    setIsTextSelected(!editor.state.selection.empty);
  };

  // editor?.commands.unsetAllMarks

  const addCommentOnSelection = () => {
    if (editor?.state.selection) {
      const { from, to, empty, $anchor } = editor.state.selection;

      if (!empty) {
        const context = editor.state.doc.textBetween(from, to, ' ');
        console.log(context);

        const thread = createThread(name, 'commenting', {
          type: 'RUIAnnoSelector',
          subtype: 'highlight',
          top: 0, // TODO: DOM-relative top position
          start: from,
          end: to
        });

        // Inject the comment as a mark into the DOM
        const encoded = thread.id;
        editor.chain().setComment(encoded).blur().run();
      }
    }

    // and clear selection somehow.
    // then focus that comment somehow...

    setIsTextSelected(false);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const { labelProps, inputProps, descriptionProps, errorMessageProps } = useTextField(
    props,
    inputRef
  );

  return (
    <FormField
      labelProps={labelProps}
      descriptionProps={descriptionProps}
      errorMessageProps={errorMessageProps}
      {...props}
    >
      <Box className="rui-border-2" p="sm">
        <EditorContent
          editor={editor}
          id={inputProps.id}
          aria-labelledby={inputProps['aria-labelledby']}
          aria-describedby={inputProps['aria-describedby']}
          // disabled, readOnly, value, name, onBlur (null), type: text
        />
        {editor?.storage.characterCount?.characters() ?? 0}/{limit} characters
        {isTextSelected && <Button onPress={addCommentOnSelection}>Comment</Button>}
      </Box>
    </FormField>
  );
}
