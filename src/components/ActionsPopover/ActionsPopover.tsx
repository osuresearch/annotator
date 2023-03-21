import React from 'react';
import styled from 'styled-components';

export type ActionsPopoverProps = {
  coords: Rect;
  onAddComment: () => void;
};

const AddHighlightButton = styled.button`
  border-radius: 3px;
  background: white;
  color: black;
  border: 1px solid grey;
  border-radius: 0;
  padding: 4px;
  margin: 4px;

  position: absolute;

  &:hover {
    background: grey;
    cursor: pointer;
  }
`;

export function ActionsPopover({ coords, onAddComment }: ActionsPopoverProps) {
  return (
    <AddHighlightButton
      style={{
        top: coords.y - 24,
        left: coords.x
      }}
      onClick={onAddComment}
    >
      💬 Comment
    </AddHighlightButton>
  );
}
