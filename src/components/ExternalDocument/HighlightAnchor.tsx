import React, { memo, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Reviewable } from './Reviewable';

function _HighlightAnchor({ source, target }: Anchor) {
  const [dom, setDOM] = useState<string>();

  // For highlight annotations, we extract the DOM and render it
  // within a separate editor to create interactivity.
  useEffect(() => {
    if (!target) {
      return;
    }

    setDOM(target.innerHTML);
    target.innerHTML = '';
  }, [target]);

  if (!dom || !target) {
    return <></>;
  }

  return createPortal(<Reviewable name={source} content={dom} />, target);
}

export const HighlightAnchor = memo<Anchor>(_HighlightAnchor);
