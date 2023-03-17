import React, { createContext, Key, useMemo, useState } from 'react';
import { useListData } from 'react-stately';

export type CellListItem = {
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

export type CellListContext = {
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

export type UseCellListReturn = CellListContext;

export const Context = createContext<CellListContext>({} as CellListContext)

export function useCellList() {
  // React-stately will do the heavy lifting of list management
  const { items, getItem, append, insertBefore, insert, remove, update, selectedKeys, setSelectedKeys } =
    useListData<CellListItem>({
      getKey: (item) => item.id
    });

  /**
   * Shift all items below (higher anchor) the initial cell down so that
   * no items overlap the initial cell or each other.
   *
   * Assumes items are sorted already by their anchorCell, lowest-first
   */
  const reflowBelow = (initialIndex: number, lowestCell: number) => {
    let prevBottom = lowestCell;

    console.log('reflowBelow', initialIndex, lowestCell);
    for (let i = initialIndex + 1; i < items.length; i++) {
      const current = items[i];
      if (current.cell < prevBottom) {
        current.cell = prevBottom;
        prevBottom = current.cell + current.height;
        console.log('shift down', current.id);

        update(current.id, { ...current });
      } else {
        // Nothing more to shift down

        // TODO: if we reflow large items and eventually create
        // a massive gap, we need a way to snap items back
        // to their anchors if they get too far and we have
        // enough room for it.
        break;
      }
    }

  };

  const reflowAbove = (initialIndex: number, highestCell: number) => {
    let prevTop = highestCell;

    console.log('reflowAbove', initialIndex, highestCell);
    for (let i = initialIndex - 1; i >= 0; i--) {
      const current = items[i];

      if (current.cell + current.height > prevTop) {
        current.cell = prevTop - current.height;
        prevTop = current.cell;
        console.log('shift up', current.id);

        update(current.id, { ...current });
      } else {
        // Nothing more to shift.

        // TODO: See the reflowBelow issue
        break;
      }
    }
  };

  const getIndex = (id: Key) => items.findIndex((i) => i.id === id);

  const selectedKey = (selectedKeys as Set<Key>).values().next().value;
  const focused = selectedKey ? getItem(selectedKey) : undefined;

  console.log('useCellList', items);
  return <UseCellListReturn>{
    items,
    focused,
    getItem,

    focus: (id) => {
      const item = getItem(id);
      if (!item) {
        return;
      }

      const index = getIndex(id);

      // Select and shift it back to its anchor
      setSelectedKeys(new Set([id]));
      update(id, {
        ...item,
        cell: item.anchorCell
      });

      // Will need to shift everything around this item
      // to make sure it aligns to its anchor correctly
      reflowAbove(index, item.cell);
      reflowBelow(index, item.cell + item.height);
    },

    resetFocus: () => {
      setSelectedKeys(new Set([]));
    },

    addItem: (item) => {
      if (getItem(item.id)) {
        throw new Error('CellListItem already exists with that ID');
      }

      // Find an insertion point based on anchor cell
      // and reflow all items below that point
      for (let i = 0; i < items.length; i++) {
        if (items[i].anchorCell >= item.anchorCell) {
          // Make room for the new insertion
          reflowAbove(i, item.anchorCell);
          reflowBelow(i - 1, item.anchorCell + item.height);

          insert(i, item);
          return;
        }
      }

      append(item);
    },

    removeItem: (id) => {
      remove(id);
    },

    updateItem: (id, item) => {
      const existing = getItem(id);
      const index = getIndex(id);

      // If the item has been forcibly moved
      // or resized - reflow nearby items
      if (item.cell !== existing.cell) {
        reflowAbove(index, item.cell);
        reflowBelow(index, item.cell + item.height);
      } else if (item.height !== existing.height) {
        reflowBelow(index, item.cell + item.height);
      }

      update(id, item);
    }
  };
}
