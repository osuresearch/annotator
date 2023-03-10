import React, { useEffect, useState } from 'react';
import { Box, Button, Group, Stack, TextAreaField } from '@osuresearch/ui';
import { FocusScope, useFocusWithin } from 'react-aria';
import { EditorContent, useEditor } from '@tiptap/react';
import Placeholder from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';
import { getHotkeyHandler } from '@mantine/hooks';

export type EditableMessageProps = {
  defaultValue: string;
  placeholder?: string;
  autosave?: boolean;
  onSave: (value: string) => void;
  onCancel: () => void;
};

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
  const { focusWithinProps } = useFocusWithin({
    onBlurWithin: (e) => {
      if (autosave) {
        handleSave();
      } else {
        handleCancel();
      }
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

    const content = editor.getHTML();
    editor.chain().clearContent().blur().run();

    onSave(content);
  };

  const handleCancel = () => {
    if (!editor) {
      return;
    }

    editor.chain().clearContent().blur().run();

    onCancel();
  };

  useEffect(() => {
    if (editor) {
      editor.commands.focus('end');
    }
  }, [editor]);

  return (
    <FocusScope contain restoreFocus autoFocus>
      <Stack align="stretch" {...focusWithinProps}>
        <Box p="xs" className="rui-border-2">
          <EditorContent
            editor={editor}
            onKeyDown={getHotkeyHandler([['mod+Enter', handleSave]])}
          />
          Hotkey: mod+Enter to save
        </Box>

        <Group justify="end">
          <Button onPress={handleSave}>Save</Button>
          <Button onPress={handleCancel}>Cancel</Button>
        </Group>
      </Stack>
    </FocusScope>
  );
}
