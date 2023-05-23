import React, { forwardRef } from 'react';
import { Button, Icon } from '@osuresearch/ui';
import { Thread } from '../Thread';
import { useAnnotationsContext } from '../../hooks/useAnnotationsContext';
import { useCellList, CellListContext as CellListContext } from '../../hooks/useCellList';

export const ThreadList = forwardRef<HTMLDivElement>((props, ref) => {
  // Source of our annotation data
  const { annotations } = useAnnotationsContext();

  // List management for adding / removing / sorting threads
  const cellList = useCellList();

  // Filter to annotations that should be shown as independent threads
  const filtered = [...annotations.filter((a) => a.motivation !== 'replying')];

  // Sort annotations based on their anchored positions
  filtered.sort((a, b) => {
    const aItem = cellList.getItem(a.id);
    const bItem = cellList.getItem(b.id);
    if (!aItem || !bItem) {
      return 0;
    }

    return aItem.anchorCell - bItem.anchorCell;
  });

  return (
    <div ref={ref}>
      {/* <Button variant="subtle" onPress={() => console.log(annotations)} style={{
        position: 'absolute',
        top: 0,
      }}>
        <Icon name="code" /> Print annotations to console
      </Button> */}

      <CellListContext.Provider value={cellList}>
        <AnchorButtons />
        {filtered?.map((anno) => (
          <Thread key={anno.id} node={anno} />
        ))}
        {/* <Debug /> */}
      </CellListContext.Provider>
    </div>
  );
});

function AnchorButtons() {
  return (
    <>

    </>
  )
}
