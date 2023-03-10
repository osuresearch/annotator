import {
  Avatar,
  Text,
  Stack,
  Group,
  TextField,
  TextAreaField,
  Paper,
  IconButton,
  Menu,
  Item,
  Chip,
  Icon,
  Link
} from '@osuresearch/ui';
import React, { useEffect, useState } from 'react';
import { useThread } from '../../hooks/useThread';
import { EditableMessage } from './EditableMessage';
import { Profile } from './Profile';
import { ReadOnlyMessage } from './ReadOnlyMessage';

export type ReplyProps = {
  thread: Annotation;
  node: Annotation;
};

/**
 * Render a comment as a reply to a thread
 */
export const Reply = React.forwardRef<HTMLDivElement, ReplyProps>(({ thread, node }, ref) => {
  const { focused, replies, updateReply, removeReply, recoverReply } = useThread(thread.id);

  const [isEditing, setEditing] = useState(false);

  // TODO: I don't like these. Stick stateful things into the hook.
  const body = node.body.find((b) => b.type === 'TextualBody') as AnnotationTextualBody;
  const state = node.body.find((b) => b.type === 'RippleReply') as AnnotationReplyBody;
  const threadState = thread.body.find((b) => b.type === 'RippleThread') as AnnotationThreadBody;

  const defaultValue = body.value;
  const { deleted, recoverable } = state;
  const { resolved } = threadState;

  const onAction = (key: React.Key) => {
    if (key === 'delete') {
      removeReply(node.id);
    }

    return true;
  };

  const onSave = (message: string) => {
    updateReply(node.id, message);
    setEditing(false);
  };

  // The first comment from an individual in a thread gets
  // a role chip. The rest don't to reduce UI noise.
  // TODO: Clean this up. It's just a hack atm.
  let isFirstFromPerson = node.creator.id !== thread.creator.id;
  let found = false;
  replies.forEach((r) => {
    if (found) {
      return;
    }

    if (r.id === node.id) {
      found = true;
      return;
    }

    if (r.creator.id === node.creator.id) {
      isFirstFromPerson = false;
    }
  });

  // Recoverable deleted replies get a placeholder to undo
  if (deleted && recoverable) {
    return (
      <Text p="xs" fs="sm">
        Deleted reply.{' '}
        <Link as="button" onClick={() => recoverReply(node.id)}>
          (undo)
        </Link>
      </Text>
    );
  }

  // Non-recoverable deleted replies are just hidden.
  if (deleted) {
    return null;
  }

  return (
    <Paper ml="sm" mt="sm">
      <Stack align="stretch" gap={0} pl="xs" tabIndex={0}>
        <Group justify="apart" align="center">
          <Profile node={node} showRole={!isFirstFromPerson} />

          {!resolved && (
            <div>
              <IconButton
                size={16}
                iconProps={{ p: 'xxs' }}
                name="edit"
                label="Edit reply"
                onPress={() => setEditing(true)}
              />

              <Menu label="More actions" /*asMoreOptions*/ onAction={onAction}>
                <Item key="delete">Delete reply</Item>
              </Menu>
            </div>
          )}
        </Group>

        {isEditing ? (
          <EditableMessage
            defaultValue={defaultValue}
            onSave={onSave}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <ReadOnlyMessage message={defaultValue} />
        )}

        {focused && !isEditing && (
          <Text c="dark" fs="xs">
            {new Date(node.created).toLocaleString()}
          </Text>
        )}
      </Stack>
    </Paper>
  );
});
