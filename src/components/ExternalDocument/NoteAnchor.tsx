import React, { SyntheticEvent, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { getHotkeyHandler } from '@mantine/hooks';
import { useFrame } from 'react-frame-component';

import { useThreads } from '../../hooks/useThreads';
import { useAnnotationFocus } from '../../hooks/useAnnotationFocus';
import { useElementPosition } from '../../hooks/useElementPosition';
import { useAnchorsContext } from '../../hooks/useAnchorsContext';

// This is living as a styled component but will probably
// be migrated to static CSS later in ExternalDocument.tsx.
// I don't really care for the styled-components lock-in.
const NotesButton = styled.button`
  border-radius: 3px;
  background: white;
  color: black;
  border: 1px solid grey;
  border-radius: 0;
  padding: 4px;
  margin: 4px;

  z-index: 999;

  // TODO: Deal with positioning. I can't guarantee a parent isn't
  // a relative position or not. I'd *like* these to be document-absolute,
  // but that means they can't be children of the target in the DOM.
  position: absolute;
  right: 0;
  display: none;

  &:hover {
    background: grey;
    cursor: pointer;
  }

  /* &[data-selected] {
    background: yellow;
  } */

  &[data-focused] {
    background: yellow;
  }

  &[data-threads] {
    display: block;
  }
`;

function NoteAnchorImpl({ source, el }: { source: string; el: HTMLElement }) {
  const { threads, isFocused, create, focusNext } = useThreads(source);

  // Update the annotation actions widget when we focus this field
  useAnnotationFocus(source, 'note', el);

  // Except there's no concept of anchors here. Fuck I need a new name for that.

  // Add hotkey support for the anchor
  useEffect(() => {
    const handler = getHotkeyHandler([
      [
        'mod+alt+M',
        () => {
          create('commenting', {
            type: 'RUIAnnoSelector',
            subtype: 'note',
            // TODO: Instance ID support
            top: el.getBoundingClientRect().top
          });
        }
      ]

      // TODO: Hotkey to focus first comment?
    ]);

    el.addEventListener('keydown', handler);
    return () => el.removeEventListener('keydown', handler);
  }, [el, create]);

  const focusThreads = (e: SyntheticEvent<HTMLButtonElement>) => {
    focusNext();
    e.preventDefault();
  };

  return createPortal(
    <NotesButton
      onClick={focusThreads}
      // data-selected={isAnnoFocused ? 'true' : undefined}
      data-focused={isFocused ? 'true' : undefined}
      data-threads={threads.length > 0 ? threads.length : undefined}
    >
      📝 {threads.length}
    </NotesButton>,
    el
  );
}

export function NoteAnchor(anchor: Anchor) {
  const { document } = useFrame();
  const [target, setTarget] = useState<HTMLElement>();
  const { addAnchors } = useAnchorsContext();

  const position = useElementPosition(target);

  useEffect(() => {
    console.log('update position', anchor, position);
    addAnchors([
      {
        ...anchor,
        target: position,
      }
    ]);
  }, [anchor, position]);

  // TODO: Remove anchors on unmount.

  useEffect(() => {
    setTarget(document?.getElementById(anchor.source) ?? undefined);
  }, [anchor.source, document]);

  if (!target) {
    return null;
  }

  return <NoteAnchorImpl source={anchor.source} el={target} />;
}
