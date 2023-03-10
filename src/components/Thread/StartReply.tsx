import React, { useState } from 'react';
import { Group, Stack, UnstyledButton } from '@osuresearch/ui';
import { EditableMessage } from './EditableMessage';
import { useThread } from '../../hooks/useThread';

export type StartReplyProps = {
  thread: Annotation;
};

export function StartReply({ thread }: StartReplyProps) {
  const [active, setActive] = useState(false);
  const { addReply } = useThread(thread.id);

  const onSave = (message: string) => {
    addReply(message);
    setActive(false);
  };

  return (
    <Stack align="stretch">
      {!active && (
        <UnstyledButton className="rui-border-2" p="xs" onPress={() => setActive(true)}>
          <Group>Reply</Group>
        </UnstyledButton>
      )}

      {active && (
        <EditableMessage
          placeholder="Reply"
          onSave={onSave}
          onCancel={() => setActive(false)}
          defaultValue=""
        />
      )}
    </Stack>
  );
}
