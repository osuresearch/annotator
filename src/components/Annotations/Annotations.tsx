import React, { forwardRef, useEffect, useLayoutEffect, useState } from 'react';
import { Code, Details, Divider, Heading, Item, Stack, UnstyledList } from '@osuresearch/ui';
import { Thread } from '../Thread';
import { useAnnotationsContext } from '../../hooks/useAnnotationsContext';
import { useAnchorsContext } from '../../hooks/useAnchorsContext';
import { useCellList, Context as CellListContext } from '../../hooks/useCellList';

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

  // List management for adding / removing / sorting threads
  const cellList = useCellList();

  // Subset of annotations we want to render as threads
  const [threads, setThreads] = useState<Annotation[]>();

  // Sort and filter annotation based on motivation (thread vs reply)
  // and the position of the anchor (target) within the DOM so that
  // we can have appropriate tab order for keyboard users.
  useEffect(() => {
    if (!annotations) return;

    console.log('update threads');

    const filtered = annotations.filter((a) => a.motivation !== 'replying');

    // Sort annotations based on their anchored positions
    filtered.sort((a, b) => {
      const aItem = cellList.getItem(a.id);
      const bItem = cellList.getItem(b.id);
      if (!aItem || !bItem) {
        return 0;
      }

      return aItem.anchorCell - bItem.anchorCell;
    });

    setThreads(filtered);
  }, [annotations]);

  return (
    <div ref={ref}>
      <CellListContext.Provider value={cellList}>
        {threads?.map((anno) => (
          <Thread key={anno.id} node={anno} />
        ))}
        <Debug />
      </CellListContext.Provider>
    </div>
  );
});
