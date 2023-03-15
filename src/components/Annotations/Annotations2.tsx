import React, { forwardRef, useEffect, useLayoutEffect, useState } from 'react';
import { Code, Details, Divider, Heading, Item, Stack, UnstyledList } from '@osuresearch/ui';
import { Thread } from '../Thread';
import { useAnnotationsContext } from '../../hooks/useAnnotationsContext';
import { useAnchorsContext } from '../../hooks/useAnchorsContext';
import { useCellList } from '../../hooks/useCellList';

function Debug() {
  const { annotations, focused } = useAnnotationsContext();
  const { items } = useAnchorsContext();

  return (
    <>
      <Details summary="🔧 Annotations">
        {focused ? 'Focused: ' + focused.id : 'No focused annotation'}
        <Code block>{JSON.stringify(annotations, undefined, 2)}</Code>
      </Details>
      <Details summary="🔧 Anchors">
        <Code block>
          {JSON.stringify(
            items.map((item) => ({
              ...item,
              target: item.target ? item.target.id : 'NONE',
              links: item.links.map((link) => link.id)
            })),
            undefined,
            2
          )}
        </Code>
      </Details>
    </>
  );
}

export type AnnotationsProps = {
  _unused?: string;
};

export const Annotations = forwardRef<HTMLDivElement>(({}, ref) => {
  // Source of our annotation data
  const { annotations } = useAnnotationsContext();

  console.log('redraw anno');
  // List management for adding / removing / sorting threads
  const cellListProps = useCellList();

  // Subset of annotations we want to render as threads
  const [threads, setThreads] = useState<Annotation[]>();

  // Sort and filter annotation based on motivation (thread vs reply)
  // and the position of the anchor (target) within the DOM so that
  // we can have appropriate tab order for keyboard users.
  useEffect(() => {
    if (!annotations) return;

    console.log('update threads');

    const filtered = annotations.filter((a) => a.motivation !== 'replying');

    setThreads(filtered);
  }, [annotations]);

  return (
    <div ref={ref}>
      {threads?.map((anno) => (
        <Thread key={anno.id} node={anno} cellListProps={cellListProps} />
      ))}

      <Debug />
    </div>
  );
});
