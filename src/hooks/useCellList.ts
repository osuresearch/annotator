import React, { createContext, Key, useLayoutEffect } from 'react';
import { useListData } from 'react-stately';

export interface CellListItem {
  id: Key;

  /**
   * Current cell number. An item may shift up or down
   * cells to make room for other items that receive
   * focus or are inserted / deleted.
   *
   * Each cell is an abstract uniform dimension.
   * Could either be pixels, multiples of pixels, etc.
   */
  cell: number;

  /**
   * The cell that this item wants to "snap to" when other items are inserted.
   *
   * If another item is inserted between this `cell` and `anchorCell`
   * of this item, this item will swap places with the inserted item
   * during sort order to ensure it's always between the new item and
   * its anchorCell.
   */
  anchorCell: number;

  /** In cells */
  height: number;
};

export interface ICellListContext {
  items: CellListItem[];

  focused: CellListItem | undefined;

  focus: (id: Key) => void;

  resetFocus: () => void;

  getItem: (id: Key) => CellListItem | undefined;

  /**
   * Inserts a new item in `anchorCell` order, lowest first.
   *
   * Insertion will potentially trigger reflow for all other items
   * to avoid overlap of cells.
   */
  addItem: (item: CellListItem) => void;

  removeItem: (id: Key) => void;

  updateItem: (id: Key, item: CellListItem) => void;
};

export type UseCellListReturn = ICellListContext;

export const CellListContext = createContext<ICellListContext>({} as ICellListContext)

export function useCellList() {
  // React-stately will do the heavy lifting of list management
  const { items, getItem, append, remove, update, selectedKeys, setSelectedKeys } =
    useListData<CellListItem>({
      getKey: (item) => item.id
    });

  // Packing algorithm that shifts EVERYTHING for tightest packing,
  // making sure the item with the given id is locked to its anchor.
  const pack = (id: React.Key) => {
    if (items.length < 1) {
      return;
    }

    // FIRST THING: Sort based on anchors. We don't have a guaranteed sort.
    const sorted = [...items].sort((a, b) => a.anchorCell - b.anchorCell);
    const anchoredIndex = sorted.findIndex((c) => c.id === id);

    if (anchoredIndex < 0) {
      return;
    }

    // Anything below (high cell) the anchored index needs to pack
    // UPWARD toward the anchor.

    const updated: number[] = [];

    // Pack items above the anchoredIndex as tightly as allowed
    // starting FROM the anchored index.
    let max = sorted[anchoredIndex].anchorCell;
    for (let i = anchoredIndex - 1; i >= 0; i--) {
      const current = sorted[i];

      // Shift down to maximum Y
      max = Math.min(current.anchorCell + current.height, max);

      if (current.cell !== max - current.height) {
        // Move it and add to the batch
        current.cell = max - current.height;
        updated.push(i);
      }

      max = current.cell;
    }

    // Fix the item at anchoredIndex to its anchor.
    if (sorted[anchoredIndex].cell !== sorted[anchoredIndex].anchorCell) {
      sorted[anchoredIndex].cell = sorted[anchoredIndex].anchorCell;
      updated.push(anchoredIndex);
    }

    // Pack items below it as tightly as allowed.
    let min = sorted[anchoredIndex].anchorCell + sorted[anchoredIndex].height;

    for (let i = anchoredIndex + 1; i < sorted.length; i++) {
      const current = sorted[i];

      // Shift up to minimum Y
      min = Math.max(current.anchorCell, min);

      if (current.cell !== min) {
        // Move it and add to the batch
        current.cell = min;
        updated.push(i);
      }

      min = current.cell + current.height;
    }

    // Batch apply updated positions for anything that was moved.
    updated.forEach((i) => update(sorted[i].id, sorted[i]));
  }

  const selectedKey = (selectedKeys as Set<Key>).values().next().value;
  const focused = selectedKey ? getItem(selectedKey) : undefined;

  // TODO(perf): This shouldn't run each time items change.
  // If the dimensions/positions don't change then we don't need to pack.
  // Should also just key this up and wait some tick before sorting again
  // because we often run into situations where multiple items are resizing
  // at the same time (or moving at the same time) and this gets called
  // a duplicate number of times.

  // Given 3 notes on one field, clicking the NoteAnchor
  // yields 4 pack executions with 3, 0, 2, 0 updated items.
  // useCellList is executed 6x times during that click.
  useLayoutEffect(() => {
    if (items.length > 0) {
      pack(focused ? focused.id : items[0].id);
    }
  }, [items, focused]);

  return <UseCellListReturn>{
    items,
    focused,
    getItem,

    focus: (id) => {
      const item = getItem(id);
      if (!item) {
        return;
      }

      // Select and shift it back to its anchor
      setSelectedKeys(new Set([id]));
    },

    resetFocus: () => {
      setSelectedKeys(new Set([]));
    },

    addItem: (item) => {
      if (getItem(item.id)) {
        throw new Error('CellListItem already exists with ID: ' + item.id);
      }

      // // Find an insertion point based on anchor cell
      // // and reflow all items below that point
      // for (let i = 0; i < items.length; i++) {
      //   if (items[i].anchorCell >= item.anchorCell) {
      //     // Make room for the new insertion
      //     // reflowAbove(i, item.anchorCell);
      //     // reflowBelow(i - 1, item.anchorCell + item.height);

      //     insert(i, item);

      //     // pack(0);
      //     return;
      //   }
      // }

      append(item);
      // pack(item.id);
    },

    removeItem: (id) => {
      remove(id);
    },

    updateItem: (id, item) => {
      update(id, item);

      // const existing = getItem(id);
      // const index = getIndex(id);

      // Anchor has moved, which requires the item to
      // be re-inserted somewhere else in the array
      // if (item.anchorCell !== existing.anchorCell) {


      //   // Find an insertion point based on anchor cell
      //   // and reflow all items below that point
      //   for (let i = 0; i < items.length; i++) {
      //     if (items[i].anchorCell >= item.anchorCell && items[i].id !== item.id) {
      //       // Make room for the new insertion
      //       // reflowAbove(i, item.anchorCell);
      //       // reflowBelow(i - 1, item.anchorCell + item.height);

      //       if (item.anchorCell === 1677) {
      //         alert('at ' + i)
      //       }

      //       move(id, i);
      //       return;
      //     }
      //   }

      //   // If it's at the very end, move it as such.
      //   if (item.anchorCell > items[items.length - 1].anchorCell) {
      //     move(id, items.length);
      //   }
      // }

      // If the item has been forcibly moved
      // or resized - reflow nearby items
      // if (item.cell !== existing.cell) {
      //   reflowAbove(index, item.cell);
      //   reflowBelow(index, item.cell + item.height);
      // } else if (item.height !== existing.height) {
      //   reflowBelow(index, item.cell + item.height);
      // }


      // pack(id);
    }
  };
}
