import React, { useContext, useEffect } from "react";

import { CellListItem, CellListContext as CellListContext } from './useCellList';

/**
 * Manage a single `CellListItem` by key in the current `useCellList` context.
 *
 * If the item does not exist, it will be added.
 *
 * If the component with this hook is unmounted, the associated
 * `CellListItem` will also be removed from the list.
 *
 * @param id
 * @param anchorCell
 * @returns
 */
export function useCellListItem(id: React.Key, anchorCell: number) {
  const { getItem, addItem, removeItem, updateItem, focus } = useContext(CellListContext);

  useEffect(() => {
    const item = getItem(id);

    if (!item) {
      addItem({
        id: id,
        cell: 0,
        anchorCell,
        height: 0
      });
    }

    if (item && anchorCell !== item.anchorCell) {
      updateItem(id, {
        ...item,
        anchorCell
      });
    }

  }, [getItem, addItem, updateItem, id, anchorCell]);

  // Remove the item on unmount of this component
  useEffect(() =>
    // noop
    () => removeItem(id)
  , [id]);

  return {
    item: getItem(id),
    update: (state: CellListItem) => {
      updateItem(id, state);
    },
    focus: () => focus(id),
  }
}
