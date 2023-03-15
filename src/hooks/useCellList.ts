import React, { Key, useMemo, useState } from 'react';
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

export type UseCellListReturn = {
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
  addItem: (id: Key, anchorCell: number, height?: number) => void;

  removeItem: (id: Key) => void;

  setHeight: (id: Key, height: number) => void;
};

export function useCellList() {
  // React-stately will do the heavy lifting of list management
  const { items, getItem, append, insert, remove, update, selectedKeys, setSelectedKeys } =
    useListData<CellListItem>({
      getKey: (item) => item.id
    });

  /**
   * Shift all items below the initial cell down so that
   * no items overlap the initial cell or each other.
   *
   * Assumes items are sorted already by their anchor cells
   */
  const reflowBelow = (initialCell: number) => {
    let prevBottom = initialCell;

    for (let i = items.length - 1; i >= 0; i--) {
      const current = items[i];
      if (current.cell < initialCell) {
        continue;
      }

      if (current.cell < prevBottom) {
        current.cell = prevBottom;
        prevBottom = current.cell + current.height;

        update(current.id, { ...current });
      } else {
        // Nothing more to shift down
        break;
      }
    }
  };

  const reflowAbove = (initialCell: number) => {
    let prevTop = initialCell;

    for (let i = items.length - 1; i >= 0; i--) {
      const current = items[i];

      if (current.cell >= initialCell) {
        continue;
      }

      if (current.cell + current.height > prevTop) {
        current.cell = prevTop - current.height;
        prevTop = current.cell;

        update(current.id, { ...current });
      } else {
        // Nothing more to shift.
        break;
      }
    }
  };

  const selectedKey = (selectedKeys as Set<Key>).values().next().value;
  const focused = selectedKey ? getItem(selectedKey) : undefined;

  console.log('useCellList', items);
  return {
    items,
    focused,
    getItem,

    focus: (id: Key) => {
      const item = getItem(id);

      // Select and shift it back to its anchor
      setSelectedKeys(new Set([id]));
      update(id, {
        ...item,
        cell: item.anchorCell
      });

      reflowAbove(item.anchorCell);
      reflowBelow(item.anchorCell + item.height);
    },

    resetFocus: () => {
      setSelectedKeys(new Set([]));
    },

    addItem: (id: Key, anchorCell: number, height = 1) => {
      const newItem: CellListItem = {
        id,
        cell: anchorCell,
        anchorCell,
        height
      };

      reflowAbove(anchorCell);

      // Find an insertion point based on anchor cell
      // and reflow all items below that point
      for (let i = 0; i < items.length; i++) {
        if (items[i].anchorCell > anchorCell) {
          reflowBelow(anchorCell + height);

          insert(i, newItem);
          return;
        }
      }

      // TODO: If cell is WAY off from anchorCell
      // the reflow might have some issues.

      append(newItem);
    },

    removeItem: (id: Key) => {
      remove(id);
    },

    setHeight: (id: Key, height: number) => {
      const item = getItem(id);
      item.height = height;

      // Shift all items under this down
      reflowBelow(item.cell + item.height);
    }
  };
}
