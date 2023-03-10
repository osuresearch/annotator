import React, { useEffect, useRef, useState } from 'react';
import { useAnnotationsContext } from '../../hooks/useAnnotationsContext';
import styled from 'styled-components';
import { AnnotationSelection, useAnnotationPicker } from '../../hooks/useAnnotationPicker';
import { useFocusWithin } from 'react-aria';
import { useFrame } from 'react-frame-component';
import { useHotkeys } from '@mantine/hooks';

const Panel = styled.div`
  position: absolute;
  right: 0;
  border: 2px solid red;
  transition: 200ms;
  background: white;
`;

const Button = styled.button`
  background: none;
  border: 0;
`;

export function SelectionActions() {
  const { document } = useFrame();
  const { selected, select } = useAnnotationPicker();
  const { createThread } = useAnnotationsContext();
  const [isFocusWithin, onFocusWithinChange] = useState(false);
  const { focusWithinProps } = useFocusWithin({
    onFocusWithinChange
  });

  const [top, setTop] = useState(0);
  const [prev, setPrev] = useState<AnnotationSelection>();
  const [active, setActive] = useState<AnnotationSelection>();

  const onAddAnnotation = () => {
    if (!active) {
      return;
    }

    const thread = createThread(active.field, 'commenting', {
      type: 'RippleAnnoSelector',
      subtype: active.type,
      // TODO: Instance ID support
      top: active.top,
      start: active.start,
      end: active.end
    });

    console.log(thread);
  };

  // TODO: All this useEffect stuff should be encapsulated elsewhere
  // to a reusable tracker of what's selected and what isn't. It
  // doesn't need to be in this component in particular.
  useEffect(() => {
    if (selected) {
      setTop(selected.top);
    }

    if (selected) {
      setPrev(selected);
    }
  }, [selected]);

  useEffect(() => {
    if (isFocusWithin) {
      setActive(prev);
    } else {
      setActive(selected);
    }
  }, [isFocusWithin, prev, selected]);

  return (
    <Panel
      style={{
        top,
        display: active ? 'block' : 'none'
      }}
      {...focusWithinProps}
    >
      <Button onClick={onAddAnnotation}>
        💬 {isFocusWithin ? 'focus' : 'nope'}
        <br />
        {selected ? selected.field : 'no sel'}
        <br />
        {prev ? 'prev: ' + prev.field : 'no prev'}
        <br />
        {active ? 'active: ' + active.field : 'no active'}
      </Button>
    </Panel>
  );
}
