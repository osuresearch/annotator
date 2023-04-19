import {
  Text,
  Stack,
  Group,
  Menu,
  Item,
  Link
} from '@osuresearch/ui';
import React, { useContext, useState } from 'react';
import { useThread } from '../../hooks/useThread';
import { EditableMessage } from './EditableMessage';
import { Profile } from './Profile';
import { ReadOnlyMessage } from './ReadOnlyMessage';
import { EditorsContext } from '../../hooks/useEditors';
import { Annotation, AnnotationTextualBody, AnnotationReplyBody, AnnotationThreadBody } from '../../types';

export type ReplyProps = {
  thread: Annotation;
  node: Annotation;
};

/**
 * Render a comment as a reply to a thread
 */
export const Reply = React.forwardRef<HTMLDivElement, ReplyProps>(({ thread, node }, ref) => {
  const { focused, replies, updateReply, removeReply, recoverReply } = useThread(thread.id);
  const { hasActiveEditor } = useContext(EditorsContext);

  const [isEditing, setEditing] = useState(false);

  // TODO: I don't like these. Stick stateful things into the hook.
  const body = node.body.find((b) => b.type === 'TextualBody') as AnnotationTextualBody;
  const state = node.body.find((b) => b.type === 'ThreadReply') as AnnotationReplyBody;
  const threadState = thread.body.find((b) => b.type === 'Thread') as AnnotationThreadBody;

  const defaultValue = body.value;
  const { deleted, recoverable } = state;
  const { resolved } = threadState;

  const onAction = (key: React.Key) => {
    if (key === 'delete') {
      removeReply(node.id);
    }
    else if (key === 'edit') {
      setEditing(true);
    }

    return true;
  };

  const onSave = (message: string) => {
    updateReply(node.id, message);
    setEditing(false);
  };

  // Non-recoverable deleted replies are just hidden.
  if (deleted && !recoverable) {
    return null;
  }

  // Recoverable deleted replies get a placeholder to undo
  if (deleted && recoverable) {
    return (
      <Text p="md" fs="sm">
        Deleted reply.{' '}
        <Link as="button" onClick={() => recoverReply(node.id)}>
          (undo)
        </Link>
      </Text>
    );
  }

  return (
    <Stack align="stretch" gap={0} pl="xl" tabIndex={0}>
      <Group justify="apart" align="center" pb="md">
        <Profile node={node} showRole />

        {!resolved && (
          <Menu label={<></>} onAction={onAction} disabledKeys={hasActiveEditor ? ['edit', 'delete'] : []}>

            {/* TODO: Disable when hasActiveEditor.
              See: https://github.com/osuresearch/ui/issues/54 */}
            <Item key="edit">Edit reply</Item>
            <Item key="delete"><Text c="error">Delete</Text></Item>
          </Menu>
        )}
      </Group>

      <Group pl="md">
        {isEditing ? (
          <EditableMessage
            defaultValue={defaultValue}
            onSave={onSave}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <ReadOnlyMessage message={defaultValue} />
        )}
      </Group>
    </Stack>
  );
});
