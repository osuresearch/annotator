import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAnnotationsContext } from '../../hooks/useAnnotationsContext';
import styled from 'styled-components';
import { useThreads } from '../../hooks/useThreads';
import { useAnnotationFocus } from '../../hooks/useAnnotationFocus';
import { getHotkeyHandler } from '@mantine/hooks';
import { useFrame } from 'react-frame-component';

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
  const { threads, isFocused, create, focus } = useThreads(source);

  // Update the annotation actions widget when we focus this field
  useAnnotationFocus(source, 'note', el);

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

  // Focus the first thread associated with this anchor
  const focusThreads = () => {
    if (threads.length > 0) focus(threads[0]);
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

export function NoteAnchor({ source, target }: Anchor) {
  if (!target) {
    return null;
  }

  return <NoteAnchorImpl source={source} el={target} />;
}
