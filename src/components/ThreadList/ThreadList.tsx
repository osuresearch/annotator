import React, { forwardRef, useEffect, useState } from 'react';
import { Thread } from '../Thread';
import { useAnnotationsContext } from '../../hooks/useAnnotationsContext';
import { useCellList, Context as CellListContext } from '../../hooks/useCellList';

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
      <CellListContext.Provider value={cellList}>
        {filtered?.map((anno) => (
          <Thread key={anno.id} node={anno} />
        ))}
        {/* <Debug /> */}
      </CellListContext.Provider>
    </div>
  );
});
