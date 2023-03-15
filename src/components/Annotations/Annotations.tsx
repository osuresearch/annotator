import React, { forwardRef, useEffect, useLayoutEffect, useState } from 'react';
import { Code, Details, Divider, Heading, Item, Stack, UnstyledList } from '@osuresearch/ui';
import { Thread } from '../Thread';
import { useAnnotationsContext } from '../../hooks/useAnnotationsContext';
import { useAnchorsContext } from '../../hooks/useAnchorsContext';
import { reflowWithBestFit } from 'src/utils';

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
  const { annotations } = useAnnotationsContext();
  const [filtered, setFiltered] = useState<Annotation[]>();
  const { getAnchorTop, reflow } = useAnchorsContext();

  // Sort and filter annotation based on motivation (thread vs reply)
  // and the position of the anchor (target) within the DOM so that
  // we can have appropriate tab order for keyboard users.
  useEffect(() => {
    if (!annotations) return;

    setFiltered(
      annotations
        .filter((a) => a.motivation !== 'replying')
        .sort((a, b) => {
          const asel = a.target.selector;
          const bsel = b.target.selector;

          const aTop = getAnchorTop({
            source: a.target.source,
            annotationId: a.id
          });

          const bTop = getAnchorTop({
            source: b.target.source,
            annotationId: b.id
          });

          console.log('top', a.target.source, a.id, aTop);
          // console.log('b top', b.target.source, b.id, aTop);

          if (asel?.type === 'RUIAnnoSelector' && bsel?.type === 'RUIAnnoSelector') {
            return aTop < bTop ? -1 : 1;
          }

          // TODO: Sorting Adobe selectors
          return 0;
        })
    );

    reflow();
  }, [annotations, getAnchorTop, reflow]);

  return (
    <div ref={ref}>
      {filtered?.map((anno) => (
        <Thread key={anno.id} node={anno} />
      ))}

      <Debug />
    </div>
  );
});
