import React, { useEffect, memo } from 'react';
import { useFrame } from 'react-frame-component';
import { StyleSheetManager } from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

import { HighlightAnchor } from './HighlightAnchor';
import { NoteAnchor } from './NoteAnchor';

import { useAnchorsContext } from '../../hooks/useAnchorsContext';

function _Controller() {
  const { document } = useFrame();
  const { items, addAnchors } = useAnchorsContext();

  if (!document) {
    return null;
  }

  // Throw portals into all the anchor targets
  useEffect(() => {
    if (!document) {
      return;
    }

    const anchors: NewAnchor[] = [];

    // Elements that can have notes attached to them
    document.querySelectorAll<HTMLElement>('[data-comment-block]').forEach((el) => {
      anchors.push({
        type: 'note',
        source: el.id,
        target: el,
        links: []
      });
    });

    // Elements that can have regions of text highlighted
    document.querySelectorAll<HTMLElement>('[data-comment-inline]').forEach((el) => {
      anchors.push({
        type: 'highlight',
        source: el.id,
        target: el,
        links: []
      });
    });

    console.log('add anchors', anchors);

    addAnchors(anchors);
  }, [document]);

  return (
    <div>
      <StyleSheetManager target={document.head}>
        <div>
          {items.map((anchor) =>
            anchor.type === 'highlight' ? (
              <HighlightAnchor key={anchor.id} {...anchor} />
            ) : (
              <NoteAnchor key={anchor.id} {...anchor} />
            )
          )}
        </div>
      </StyleSheetManager>
    </div>
  );
}

/**
 * Controller is injected into the iframe DOM for
 * managing thread anchors and global states.
 */
export const Controller = memo(_Controller);
