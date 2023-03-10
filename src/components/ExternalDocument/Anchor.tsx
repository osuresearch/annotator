import React, { memo, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { NoteAnchor } from './NoteAnchor';
import { Reviewable } from './Reviewable';

export type AnchorProps = {
  id: string;
  el: HTMLElement;
  type: RippleAnnoSubtype;
};

function _Anchor({ id, el, type }: AnchorProps) {
  const [dom, setDOM] = useState<string>();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // For highlight annotations, we extract the DOM and render it
    // within a separate editor to create interactivity.
    if (type === 'highlight') {
      setDOM(el.innerHTML);
      el.innerHTML = '';
    }
  }, [el, type]);

  if (type === 'highlight' && dom) {
    return createPortal(<Reviewable ref={ref} name={id} content={dom} />, el);
  }

  if (type === 'note') {
    return <NoteAnchor el={el} name={id} />;
  }

  return null;
}

export const Anchor = memo<AnchorProps>(_Anchor);
