import {
  Text,
  Stack,
  Group,
  Paper,
  IconButton,
  Menu,
  Item,
  Chip,
  Icon,
  Link,
  cx,
  Box
} from '@osuresearch/ui';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useThread } from '../../hooks/useThread';
import { useAnchorsContext } from '../../hooks/useAnchorsContext';
import { EditableMessage } from './EditableMessage';
import { Reply } from './Reply';
import { StartReply } from './StartReply';
import { ReadOnlyMessage } from './ReadOnlyMessage';
import { Profile } from './Profile';
import { AnchoredContainer } from '../AnchoredContainer';
import { EditorsContext } from '../../hooks/useEditors';
import { Annotation, AnnotationTextualBody, AnnotationThreadBody, AnchorRef } from '../../types';

export type ThreadProps = {
  node: Annotation;
};

export function Thread({ node }: ThreadProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { getAnchor } = useAnchorsContext();
  const { hasActiveEditor } = useContext(EditorsContext);

  const body = node.body.find((b) => b.type === 'TextualBody') as AnnotationTextualBody;
  const state = node.body.find((b) => b.type === 'Thread') as AnnotationThreadBody;

  // Threads use an anchor to either:
  //  1. An Element ID if the annotation target is simply a fragment
  //  2. An explicit annotation ID if the target is a fragment that is refined by a text position

  // Threads reference *either* an anchor that references
  // the same node ID (in the case of highlights) OR
  // anchors that reference the parent field (target.source)
  if (node.target.selector?.type !== 'FragmentSelector') {
    throw new Error(
      'Unexpected target selector associated with thread annotation. Expected FragmentSelector'
    );
  }

  const fragment = node.target.selector;

  const anchorRef: AnchorRef = {
    id: fragment.refinedBy?.type === 'TextPositionSelector'
      ? node.id
      : undefined,
    source: fragment.value,
  }

  const anchor = getAnchor(anchorRef);

  const { focused, replies, focus, updateComment, resolve, reopen, remove, recover } = useThread(
    node.id
  );

  const [isEditing, setEditing] = useState(false);
  const [isAutofocus, setAutofocus] = useState(false);

  const defaultValue = body.value;
  const { deleted, recoverable, resolved } = state;

  // An initial thread is one where the user hasn't added any
  // content yet to the main thread comment.
  const isInitial = defaultValue.trim().length < 1;

  // If this thread needs to be focused immediately on mount,
  // and we don't have any content (e.g. someone just started
  // a new thread) - force it into focus mode.
  useEffect(() => {
    if (!ref.current) return;

    if (focused && isInitial) {
      setEditing(true);
      setAutofocus(true);
    }

    // const rect = ref.current.getBoundingClientRect();
    // if (!isInViewport(window, rect)) {
    //   window.scrollTo(rect.x, rect.y - 100);
    // }
  }, [node, ref, focused, isInitial]);

  // Scroll this comment into view if not already.
  // useEffect(() => {
  //   if (!ref.current || !focused) return;

  //   const rect = ref.current.getBoundingClientRect();
  //   if (!isInViewport(window, rect)) {
  //     ref.current.scrollIntoView({
  //       behavior: 'smooth',
  //       block: 'center'
  //     });
  //   }
  // }, [focused, ref]);

  const onAction = (key: React.Key) => {
    if (key === 'resolve') {
      resolve();
    } else if (key === 'delete') {
      remove();
    } else if (key === 'edit') {
      setEditing(true);
    }

    return true;
  };

  const onSave = (message: string) => {
    // Nothing was saved.
    if (message.trim() === '<p></p>') {
      message = '';
    }

    updateComment(message);
    setEditing(false);

    if (!message.length && message.length < 1) {
      remove(false);
    }
  };

  const onCancel = () => {
    setEditing(false);

    // If the thread has no comment or replies, we delete it entirely.
    // This may have been a thread that was started by accident, or
    // the user decided to scrub it.
    if (defaultValue.length < 1 && replies.length < 1) {
      remove(false);
    }
  };

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const onEnter = () => {
      focus();
    }

    ref.current.addEventListener('click', onEnter);
    return () => {
      ref.current?.removeEventListener('click', onEnter);
    };
  }, [ref, focus]);

  // Recoverable deleted threads get a placeholder to undo
  if (deleted && recoverable) {
    return (
      <Paper withBorder p="xs">
        Deleted thread.{' '}
        <Link as="button" onClick={recover}>
          (undo)
        </Link>
      </Paper>
    );
  }

  // Non-recoverable deleted threads are just hidden.
  if (deleted) {
    return null;
  }

  return (
    <AnchoredContainer id={node.id} anchor={anchor} focused={focused} gap={16}>
      <Paper
        id={'thread-' + node.id}
        p="xs"
        ml="xl"
        ref={ref}
        tabIndex={0}
        className={cx({
          'rui-border-2': true,
          'rui-border-light': !focused,
          'rui-border-blue': focused,
        })}
        w={400 - 48}
      >
        <Stack align="stretch" gap="md" px="xs" pb="xs">
          {resolved && (
            <Group justify="apart" align="center">
              <Profile node={node} />

              <Group align="center">
                <Chip variant="outline" c="green">
                  <Icon name="check" /> resolved
                </Chip>
                <IconButton
                  size={16}
                  iconProps={{ p: 'xxs' }}
                  name="rotate"
                  label="Reopen"
                  onPress={reopen}
                />
              </Group>
            </Group>
          )}

          {!resolved && (
            <Group justify="apart" align="center">
              <Profile node={node} showRole />
              {/* TODO: Disable when hasActiveEditor.
                See: https://github.com/osuresearch/ui/issues/54 */}
              <Menu label={<></>} /*"Actions" /*asMoreOptions*/ onAction={onAction}
                disabledKeys={hasActiveEditor ? ['edit', 'resolve', 'delete'] : []}>
                <Item key="edit">Edit comment</Item>
                <Item key="resolve">Resolve thread</Item>
                <Item key="delete"><Text c="error">Delete thread</Text></Item>
              </Menu>
            </Group>
          )}

          <Box pl="sm">
            {isEditing ? (
              <EditableMessage
                defaultValue={defaultValue}
                autosave={isAutofocus}
                onSave={onSave}
                onCancel={onCancel}
              />
            ) : (
              <ReadOnlyMessage message={defaultValue} />
            )}

            {resolved && replies.length > 0 && !focused && (
              <Text fs="xs" fw="bold">
                {replies.length === 1 ? '1 more reply' : replies.length + ' more replies'}
              </Text>
            )}
          </Box>

          {(!resolved || focused) &&
            replies.map((reply) => <Reply key={reply.id} thread={node} node={reply} />)}

          {!resolved && !isInitial && focused && <StartReply thread={node} />}
        </Stack>
      </Paper>
    </AnchoredContainer>
  );
}
