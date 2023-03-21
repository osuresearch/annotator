import React, { memo, useContext, useEffect } from "react";
import { useElementSize } from "../../hooks/useElementSize";
import { Context as CellListContext } from '../../hooks/useCellList';
import styled from "styled-components";
import { useCellListItem } from "../../hooks/useCellListItem";

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
  const anchorPos = anchor?.target || { y: 0, x: 0, width: 0, height: 0 };

  const { ref, height } = useElementSize();
  const heightWithGap = height + gap;

  const { item, update, focus } = useCellListItem(id, anchorPos.y);

  useEffect(() => {
    if (!item) {
      return;
    }

    const updated = {...item};

    if (heightWithGap !== item.height) {
      updated.height = heightWithGap;
      update(updated);
    }

    if (focused) {
      focus();
    }
  }, [item, id, anchorPos, heightWithGap, focused]);

  return (
    <AnimatedContainer ref={ref} style={{
      position: 'absolute',
      transform: item?.cell
        ? `translateY(${item?.cell ?? 0}px) translateX(${focused ? -12 :0}px)`
        : undefined,
    }}>
      {children}
    </AnimatedContainer>
  );
}
