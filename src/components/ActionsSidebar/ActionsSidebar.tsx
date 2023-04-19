import React, { useEffect, useState } from 'react';
import { useAnnotationsContext } from '../../hooks/useAnnotationsContext';
import styled from 'styled-components';
import { AnnotationSelection, useAnnotationPicker } from '../../hooks/useAnnotationPicker';
import { useFocusWithin } from 'react-aria';
import { IconButton, Tooltip } from '@osuresearch/ui';
import { AnnotationMotivation } from '../../types';

const Panel = styled.div`
  position: absolute;
  right: 0;
  transition: 200ms;
  background: var(--rui-light);
  border: 2px solid var(--rui-light-shade);
  flex-direction: column;
  margin-right: 4px;
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

    const thread = createThread('commenting', {
      type: 'FragmentSelector',
      value: active.targetField,

      // If we have a text range selected, use that as refinement.
      refinedBy: (active.start && active.end)
        ? {
            type: 'TextPositionSelector',
            start: active.start,
            end: active.end
        }
        : undefined
    });
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
          name="questioningComment"
          label="Ask a question"
          size={24}
          onPress={() => startThread('questioning')}
        />
      </Tooltip>

      <Tooltip contentSlot="Add a comment">
        <IconButton
          name="addComment"
          label="Add a comment"
          size={24}
          onPress={() => startThread('commenting')}
        />
      </Tooltip>

      <Tooltip contentSlot="Make a suggestion">
        <IconButton name="suggestionComment" label="Make a suggestion" size={24} />
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
