import React, { useRef, useEffect, useState, memo } from 'react';
import { cx } from '@osuresearch/ui';
import styled from 'styled-components';
import { useAnchorsContext, useAnnotationPicker } from '../../hooks';
import { getDocumentPosition } from '../../utils';
import { Rect } from '../../types';
import { useThreads } from '../../hooks/useThreads';

export type NoteAnchorProps = {
  id: string
  children: React.ReactNode
}

const Root = styled.div`
  position: inline-block;
  cursor: pointer;

  &:hover {
    background-color: #fff5e3;
  }

  &.selected {
    background-color: #fff5e3;
  }

  &.focused {
    background-color: #fff5e3;
  }
`;

function _NoteAnchor({ id, children }: NoteAnchorProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<Rect>({ x: -1, y: 0, width: 0, height: 0 });

  const { addAnchors, removeAnchor, ref } = useAnchorsContext();

  // NoteAnchorImpl things
  const { isFocused } = useThreads(id);

  const { selected, select } = useAnnotationPicker();

  // Update the annotation actions widget when we focus this field
  // useAnnotationFocus('note_src', 'note', targetRef.current);
  // Doesn't work, cuz null...

  const onFocus = (e: React.FocusEvent) => {
    const position = getDocumentPosition(e.target as HTMLElement, ref.current as HTMLElement);
    select({
      targetField: id,
      type: 'note',
      top: position.top
    });
  };

  const onBlur = () => {
    if (selected?.targetField === id) {
      select(undefined);
    }
  };


  // Position monitoring and anchor target updates
  useEffect(() => {
    let prev = rect;

    function updatePosition() {
      if (!targetRef.current) return;

      const position = getDocumentPosition(targetRef.current, ref.current as HTMLElement);
      const r: Rect = {
        x: Math.round(position.left),
        y: Math.round(position.top),
        width: Math.round(targetRef.current.clientWidth),
        height: Math.round(targetRef.current.clientHeight),
      }

      if (r.x !== prev.x || r.y !== prev.y || r.width !== prev.width || r.height !== prev.height) {
        prev = r;
        setRect(r);

        // Update anchor target(s)
        addAnchors([
          {
            id: id,
            type: 'note',
            source: id,
            target: r,
          }
        ])
      }
    }

    // TODO: No.
    const handle = setInterval(updatePosition, 300);

    return () => clearInterval(handle);
  }, [targetRef]);

  // Remove the anchor from the track list on unmount
  useEffect(() => () => removeAnchor(id), []);

  const isSelected = selected?.targetField === id;

  return (
    <Root ref={targetRef} id="foo"
      tabIndex={0}
      onFocus={onFocus}
      onBlur={onBlur}
      className={cx(
        { 'selected' : isSelected },
        { 'focused': isFocused },
      )}
    >
      {/* <Chip>
        {rect.x}, {rect.y}
        {isSelected ? ' selected' : ''}
      </Chip> */}

      {/* <div style={{
        position: 'absolute',
        width: 3000,
        height: 1,
        backgroundColor: 'green',
        top: rect.y,
        left: 0,
        marginLeft: -1000,
        zIndex: 9999,
      }} /> */}

      {children}
    </Root>
  );
}

export const NoteAnchor = memo(_NoteAnchor);
