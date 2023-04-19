import React, { useEffect } from "react";
import styled from "styled-components";
import { IconButton } from "@osuresearch/ui";
import { useCellListItem } from "../../hooks/useCellListItem";
import { Anchor } from '../../types';
import { useElementSize } from "../../hooks/useElementSize";

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
    <>
    <IconButton size={20} label="Icon here" name="comment" style={{
      position: 'absolute',
      transform: `translateY(${item?.anchorCell ?? 0}px) translateX(-48px)`
    }} />

    <AnimatedContainer ref={ref} style={{
      position: 'absolute',
      transform: item?.cell
        ? `translateY(${item?.cell ?? 0}px) translateX(${focused ? -12 :0}px)`
        : undefined,
    }}>
      {children}
    </AnimatedContainer>
    </>
  );
}
