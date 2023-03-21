import React, { useEffect, useRef, useState } from 'react';
import { useAnnotationsContext } from '../../hooks/useAnnotationsContext';
import styled from 'styled-components';
import { AnnotationSelection, useAnnotationPicker } from '../../hooks/useAnnotationPicker';
import { useFocusWithin } from 'react-aria';
import { IconButton, Tooltip } from '@osuresearch/ui';

const Panel = styled.div`
  position: absolute;
  right: 0;
  transition: 200ms;
  background: var(--rui-light);
  border: 2px solid var(--rui-light-shade);
  flex-direction: column;
  margin-right: 4px;
`;

const Button = styled.button`
  background: none;
  border: 0;
`;

export function ActionsSidebar() {
  const { selected, select } = useAnnotationPicker();
  const { createThread } = useAnnotationsContext();
  const [isFocusWithin, onFocusWithinChange] = useState(false);
  const { focusWithinProps } = useFocusWithin({
    onFocusWithinChange
  });

  const [top, setTop] = useState(0);
  const [prev, setPrev] = useState<AnnotationSelection>();
  const [active, setActive] = useState<AnnotationSelection>();

  const startThread = (motivation: AnnotationMotivation) => {
    if (!active) {
      return;
    }

    // Now I need context for highlights.
    // if (selected?.type === 'highlight') {
    //   const thread = createThread(selected.source, 'commenting', {
    //     type: 'RUIAnnoSelector',
    //     subtype: 'highlight',
    //     top: selected.top,
    //     start: selected.start,
    //     end: selected.end
    //   });
    // }

    const thread = createThread(active.source, 'commenting', {
      type: 'RUIAnnoSelector',
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
        display: active ? 'flex' : 'none'
      }}
      {...focusWithinProps}
    >
      <Tooltip contentSlot="Ask a question">
        <IconButton
          name="question"
          label="Ask a question"
          size={24}
          onPress={() => startThread('questioning')}
        />
      </Tooltip>

      <Tooltip contentSlot="Add a comment">
        <IconButton
          name={active?.type === 'note' ? "image" : 'edit'}
          label="Add a comment"
          size={24}
          onPress={() => startThread('commenting')}
        />
      </Tooltip>

      <Tooltip contentSlot="Make a suggestion">
        <IconButton name="edit" label="Make a suggestion" size={24} />
      </Tooltip>
      {/* <Button>
        💬 {isFocusWithin ? 'focus' : 'nope'}
        <br />
        {selected ? selected.source : 'no sel'}
        <br />
        {prev ? 'prev: ' + prev.source : 'no prev'}
        <br />
        {active ? 'active: ' + active.source : 'no active'}
      </Button> */}
    </Panel>
  );
}
