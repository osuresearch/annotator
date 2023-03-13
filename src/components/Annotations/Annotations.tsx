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
    <Details summary="🔧 Debug">
      {focused ? 'Focused: ' + focused.id : 'No focused annotation'}

      <Code block>{JSON.stringify(annotations, undefined, 2)}</Code>

      <Code block>{JSON.stringify(items, undefined, 2)}</Code>
    </Details>
  );
}

export type AnnotationsProps = {
  _unused?: string;
};

export const Annotations = forwardRef<HTMLDivElement>(({}, ref) => {
  const { annotations } = useAnnotationsContext();
  const [filtered, setFiltered] = useState<Annotation[]>();
  const { items, getAnchorTop } = useAnchorsContext();

  // Sort and filter annotation based on motivation (thread vs reply)
  // and the position of the anchor (target) within the DOM
  useEffect(() => {
    if (!annotations) return;

    setFiltered(
      annotations
        .filter((a) => a.motivation !== 'replying')
        .sort((a, b) => {
          const asel = a.target.selector;
          const bsel = b.target.selector;

          if (asel?.type === 'RUIAnnoSelector' && bsel?.type === 'RUIAnnoSelector') {
            return getAnchorTop(a.target.source, a.id) < getAnchorTop(b.target.source, b.id)
              ? -1
              : 1;
          }

          // TODO: Sorting Adobe selectors
          return 0;
        })
    );
  }, [annotations, getAnchorTop]);

  const [firstReflow, setFirstReflow] = useState(true);

  // // First time we get a batch of annotations, reflow annotations
  // // to align with their context in the source document.
  // useEffect(() => {
  //   if (!items || !annotations) {
  //     return;
  //   }

  //   if (firstReflow) {
  //     alert('first reflow');
  //     setFirstReflow(false);
  //     reflowWithBestFit()
  //   }
  //   // reflowWithBestFit()
  // }, [items, annotations, firstReflow]);

  // NOTE: The .map won't be super performant here.
  // Will most likely want to go the route of something
  // like React Stately's collection renderer.
  // Or something from RUI if I have an unstyled wrapper.
  return (
    <div ref={ref}>
      {filtered?.map((anno) => (
        <Thread key={anno.id} node={anno} />
      ))}

      <Debug />
    </div>
  );
});
