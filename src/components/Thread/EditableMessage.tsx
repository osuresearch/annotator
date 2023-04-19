import React, { useEffect, useContext } from 'react';
import { Button, Group, Stack, Text } from '@osuresearch/ui';
import { useFocusWithin } from 'react-aria';
import { EditorContent, useEditor } from '@tiptap/react';
import Placeholder from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';
import { getHotkeyHandler } from '@mantine/hooks';
import styled from 'styled-components';
import { EditorsContext } from '../../hooks/useEditors';

export type EditableMessageProps = {
  defaultValue: string;
  placeholder?: string;
  autosave?: boolean;
  onSave: (value: string) => void;
  onCancel: () => void;
};

const EditorStyles = styled.div`

  .ProseMirror {
    border: 1px solid var(--rui-light);
    padding: var(--rui-spacing-xs);
  }
  .ProseMirror-focused {
    outline: none;
    border: 1px solid var(--rui-light);
  }
`;

/**
 * Rich text editor with a save/cancel button visible on mount.
 *
 * a11y
 * - Focuses on the text input on mount
 * - Traps keyboard focus until closed
 */
export function EditableMessage({
  defaultValue,
  placeholder,
  autosave = false,
  onSave,
  onCancel
}: EditableMessageProps) {
  const { setActiveEditor } = useContext(EditorsContext);

  const { focusWithinProps } = useFocusWithin({
    onBlurWithin: (e) => {
      // if (autosave) {
      //   handleSave();
      // } else {
      //   handleCancel();
      // }
    }
  });

  const editor = useEditor(
    {
      content: defaultValue,
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder
        })
      ]
    },
    []
  );

  const handleSave = () => {
    if (!editor) {
      return;
    }

    const textContent = editor.getText();
    const content = editor.getHTML();

    editor.chain().clearContent().blur().run();

    setActiveEditor(false);
    if (textContent.length > 0) {
      onSave(content);
    }
    else {
      onCancel();
    }
  };

  const handleCancel = () => {
    if (!editor) {
      return;
    }

    editor.chain().clearContent().blur().run();

    setActiveEditor(false);
    onCancel();
  };

  useEffect(() => {
    if (editor) {
      editor.commands.focus('end');
    }

    setActiveEditor(true);

    return () => setActiveEditor(false);
  }, [editor]);

  return (
    <Stack align="stretch" fs="sm">
      <EditorStyles>
        <EditorContent
          editor={editor}
          onKeyDown={getHotkeyHandler([['mod+Enter', handleSave]])}
        />
      </EditorStyles>

      <Group justify="end" align="center">
        <Text fs="xs" c="dark">Tip: Press Ctrl+Enter to save.</Text>
        <Button variant="subtle" onPress={handleCancel}>Cancel</Button>
        <Button onPress={handleSave}>Save</Button>
      </Group>
    </Stack>
  );
}
