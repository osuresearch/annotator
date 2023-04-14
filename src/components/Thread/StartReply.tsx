import React, { useState, useContext } from 'react';
import { Group, Stack, UnstyledButton } from '@osuresearch/ui';
import styled from 'styled-components';
import { useThread } from '../../hooks/useThread';
import { Context as EditorsContext } from '../../hooks/useEditors';
import { EditableMessage } from './EditableMessage';
import { Annotation } from '../../types';

export type StartReplyProps = {
  thread: Annotation;
};

const Root = styled.div`
  border: 1px solid var(--rui-light);
  padding: var(--rui-spacing-xs);
`;

export function StartReply({ thread }: StartReplyProps) {
  const { hasActiveEditor } = useContext(EditorsContext);
  const [active, setActive] = useState(false);
  const { addReply } = useThread(thread.id);

  const onSave = (message: string) => {
    addReply(message);
    setActive(false);
  };

  const onCancel = () => {
    setActive(false);
  }

  const onReply = () => {
    setActive(true);
  }

  return (
    <Stack align="stretch" fs="sm">
      {!active && (
        <UnstyledButton isDisabled={hasActiveEditor} as={Root} onPress={onReply} c="dark">
          <Group>
            {hasActiveEditor
              ? 'Another comment is in progress.'
              : 'Reply'
            }</Group>
        </UnstyledButton>
      )}

      {active && (
        <EditableMessage
          placeholder="Reply"
          onSave={onSave}
          onCancel={onCancel}
          defaultValue=""
        />
      )}
    </Stack>
  );
}
