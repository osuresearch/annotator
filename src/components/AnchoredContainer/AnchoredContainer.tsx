import React, { useContext, useEffect } from "react";
import { useElementSize } from "../../hooks/useElementSize";
import { Context as CellListContext } from '../../hooks/useCellList';
import styled from "styled-components";

export type AnchoredContainerProps = {
  id: string
  anchor?: Anchor
  focused: boolean
  children: React.ReactNode

  /**
   * Additional spacing between adjacent containers
   */
  gap: number;
}

const AnimatedContainer = styled.div`
  transition: 200ms;
`;

/**
 * Responsible for keeping body content aligned with a target anchor.
 */
export function AnchoredContainer({ id, anchor, focused, gap, children }: AnchoredContainerProps) {
  const { getItem, addItem, removeItem, updateItem, focus } = useContext(CellListContext);
  const anchorPos = anchor?.target || { y: 0, x: 0, width: 0, height: 0 };

  const item = getItem(id);

  const { ref, height } = useElementSize();
  const heightWithGap = height + gap;

  // Sync mount of this component with a cell list entry.
  // Only execute once we have an anchor position.
  // And whenever the anchor moves, this should re-mount the
  useEffect(() => {
    if (anchorPos.y === 0) {
      return;
    }

    addItem({ id, anchorCell: anchorPos.y, cell: anchorPos.y, height: heightWithGap });

    return () => removeItem(id);
    // TODO: anchorPos causes re-renders and a crash due to duplicate addItem() calls.
  }, [id, anchorPos.y]);

  useEffect(() => {
    // Add an item to the cell list if we just mounted
    const item = getItem(id);
    if (item) {
      const updated = {...item};

      let changed = false;
      // if (anchorPos.y !== item.anchorCell) {
      //   console.log('set anchor', id);
      //   updated.anchorCell = anchorPos.y;
      //   changed = true;
      // }

      // // Lock the container to the anchor cell when focused
      // if (focused && item.anchorCell !== item.cell) {
      //   console.log('focus and lock', id);
      //   updated.cell = item.anchorCell;
      //   changed = true;
      // }

      if (heightWithGap !== item.height) {
        console.log('change height', id);
        updated.height = heightWithGap;
        changed = true;
      }

      // // if (item.anchorCell === item.cell) {
      // //   console.log('match anchor', id);
      // //   updated.cell = updated.anchorCell;
      // //   changed = true;
      // // }

      if (changed) {
        updateItem(id, updated);
      }

      if (focused) {
        focus(id);
      }
    }
  }, [id, anchorPos, heightWithGap, focused]);

  // This whole component can be encapsulated into a hook.

  // TODO: Container MUST always be rendering (no early out)
  // but also it needs to translateY correctly on mount rather
  // than jumping to match cell.
  // Or fade it in.. idk.

  return (
    <AnimatedContainer ref={ref} style={{
      position: 'absolute',
      transform: item?.cell
        ? `translateY(${item?.cell ?? 0}px) translateX(${focused ? -20 :0}px)`
        : undefined,
    }}>
      {/* {item?.id} - {item?.anchorCell ?? 'no anchor'} - {item?.cell ?? 'no cell'}
      <br/>
      {JSON.stringify(anchor?.target)} */}
      {/* <br/>
      height: {height} */}
      {children}
    </AnimatedContainer>
  );
}
