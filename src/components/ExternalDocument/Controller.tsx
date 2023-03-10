import React, { useEffect, memo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useFrame } from 'react-frame-component';
import { StyleSheetManager } from 'styled-components';

import { Anchor, AnchorProps } from './Anchor';
import { SelectionActions } from './SelectionActions';
import { TableOfContents } from './TableOfContents';

function _Controller() {
  const { document } = useFrame();
  const [anchors, setAnchors] = useState<AnchorProps[]>([]);

  if (!document) {
    return null;
  }

  // Throw portals into all the anchor targets
  useEffect(() => {
    if (!document) {
      return;
    }

    const anchorProps: AnchorProps[] = [];

    document.querySelectorAll<HTMLElement>('[data-comment-block]').forEach((el) => {
      anchorProps.push({
        type: 'note',
        id: el.id,
        el
      });
    });

    document.querySelectorAll<HTMLElement>('[data-comment-inline]').forEach((el) => {
      anchorProps.push({
        type: 'highlight',
        id: el.id,
        el
      });
    });

    setAnchors(anchorProps);
  }, [document]);

  return (
    <div>
      <StyleSheetManager target={document.head}>
        <div>
          <TableOfContents />
          <SelectionActions />
          {anchors.map((anchorProps) => (
            <Anchor key={anchorProps.id} {...anchorProps} />
          ))}
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
