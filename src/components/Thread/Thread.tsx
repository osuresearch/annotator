import {
  Avatar,
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
  Code
} from '@osuresearch/ui';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FocusScope } from 'react-aria';
import { useThread } from '../../hooks/useThread';
import { useAnchorsContext } from '../../hooks/useAnchorsContext';
import { EditableMessage } from './EditableMessage';
import { Reply } from './Reply';
import { StartReply } from './StartReply';
import { ReadOnlyMessage } from './ReadOnlyMessage';
import { isInViewport } from '../../utils';
import { Profile } from './Profile';
import { CellListItem, UseCellListReturn } from '../../hooks/useCellList';

export type ThreadProps = {
  node: Annotation;
  cellListProps: UseCellListReturn;
};

function AnchorDebug({
  node,
  el,
  items
}: {
  node: Annotation;
  el?: HTMLDivElement | null;
  items: CellListItem[];
}) {
  const { getAnchor } = useAnchorsContext();

  if (!el) {
    return null;
  }

  const fieldAnchor = getAnchor({
    source: node.target.source
  });

  const scopedAnchor = getAnchor({
    source: node.target.source,
    annotationId: node.id
  });

  return (
    <div>
      {node.target.source}
      <br />
      {fieldAnchor ? fieldAnchor.id : ' no field anchor'}
      <br />
      {scopedAnchor ? scopedAnchor.id : ' no scoped anchor'}
      <br />
      <Text fw="bold">{fieldAnchor?.target?.getBoundingClientRect().top}</Text>
      <Code block>{JSON.stringify(items, undefined, 2)}</Code>
    </div>
  );
}

export function Thread({ node, cellListProps }: ThreadProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { getAnchorTop, getAnchor } = useAnchorsContext();

  const { getItem, addItem, removeItem, setHeight } = cellListProps;

  const { focused, replies, focus, updateComment, resolve, reopen, remove, recover } = useThread(
    node.id
  );

  const [isEditing, setEditing] = useState(false);
  const [isAutofocus, setAutofocus] = useState(false);

  const body = node.body.find((b) => b.type === 'TextualBody') as AnnotationTextualBody;
  const state = node.body.find((b) => b.type === 'Thread') as AnnotationThreadBody;

  const defaultValue = body.value;
  const { deleted, recoverable, resolved } = state;

  // An initial thread is one where the user hasn't added any
  // content yet to the main thread comment.
  const isInitial = defaultValue.trim().length < 1;

  useLayoutEffect(() => {
    const id = node.id;

    addItem(id, 0, 1);

    return () => {
      removeItem(id);
    };
  }, [node]);

  useEffect(() => {
    const anchor = getAnchor({
      source: node.target.source
      // todo: the rest
    });

    // Still waiting for the anchor to mount
    if (!anchor || !anchor.target) {
      return;
    }

    console.log(anchor);

    // TODO: Listen for changes
  }, [getItem, getAnchor, node]);

  // If this thread needs to be focused immediately on mount,
  // and we don't have any content (e.g. someone just started
  // a new thread) - force it into focus mode.
  useLayoutEffect(() => {
    if (!ref.current) return;

    if (focused && isInitial) {
      setEditing(true);
      setAutofocus(true);
    }

    const rect = ref.current.getBoundingClientRect();
    if (!isInViewport(window, rect)) {
      window.scrollTo(rect.x, rect.y - 100);
    }

    // TODO: This is a hack that doesn't handle Adobe/etc. Fix.
    const selectorType = (node.target.selector?.subtype ?? 'note') as RUIAnnoSubtype;

    // Map thread to its anchor
    // link({
    //   source: node.target.source,
    //   type: selectorType,

    //   // Highlights have an explicit target selector
    //   annotationId: selectorType === 'highlight' ? node.id : undefined,
    // }, ref.current);
  }, [node, ref, focused, isInitial]);

  // Scroll this comment into view if not already.
  useEffect(() => {
    if (!ref.current || !focused) return;

    const rect = ref.current.getBoundingClientRect();
    if (!isInViewport(window, rect)) {
      ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [focused, ref]);

  const onAction = (key: React.Key) => {
    if (key === 'resolve') {
      resolve();
    } else if (key === 'delete') {
      remove();
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

  // TODO: Ref can't be changed around due to thread state things.
  // Need to always keep this thread in the DOM somehow without unmounting.

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
    <FocusScope>
      <Paper
        id={'thread-' + node.id}
        p="xs"
        ml="sm"
        ref={ref}
        tabIndex={0}
        onClick={focus}
        className={cx({
          'rui-border-2': true,
          'rui-border-light': !focused,
          'rui-border-blue': focused
        })}
        // style={{
        //   position: 'absolute',
        //   top: 0
        // }}
      >
        <div className="edge">
          <div className="edge__mark" />
        </div>
        <Stack align="stretch" gap={0} pl="xs">
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
              <div>
                <IconButton
                  size={16}
                  iconProps={{ p: 'xxs' }}
                  name="edit"
                  label="Edit comment"
                  onPress={() => setEditing(true)}
                />
                <Menu label="More actions" /*asMoreOptions*/ onAction={onAction}>
                  <Item key="link">Link to thread</Item>
                  <Item key="resolve">Resolve thread</Item>
                  <Item key="delete">Delete thread</Item>
                </Menu>
              </div>
            </Group>
          )}

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

          {focused && !isEditing && (
            <Text c="dark" fs="xs">
              {new Date(node.created).toLocaleString()}
            </Text>
          )}

          {resolved && replies.length > 0 && !focused && (
            <Text fs="xs" fw="bold">
              {replies.length === 1 ? '1 more reply' : replies.length + ' more replies'}
            </Text>
          )}

          {(!resolved || focused) &&
            replies.map((reply) => <Reply key={reply.id} thread={node} node={reply} />)}

          {!resolved && !isInitial && <StartReply thread={node} />}
        </Stack>

        <AnchorDebug node={node} el={ref.current} items={[]} />
      </Paper>
    </FocusScope>
  );
}
