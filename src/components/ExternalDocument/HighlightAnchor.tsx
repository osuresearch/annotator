import React, { memo, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { NoteAnchor } from './NoteAnchor';
import { Reviewable } from './Reviewable';

function _HighlightAnchor({ source, el, type }: Anchor) {
  const [dom, setDOM] = useState<string>();

  useEffect(() => {
    // For highlight annotations, we extract the DOM and render it
    // within a separate editor to create interactivity.
    if (type === 'highlight') {
      setDOM(el.innerHTML);
      el.innerHTML = '';
    }
  }, [el, type]);

  if (!dom) {
    return <></>;
  }

  return createPortal(<Reviewable name={source} content={dom} />, el);
}

export const HighlightAnchor = memo<Anchor>(_HighlightAnchor);
