import React, { memo, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useFrame } from 'react-frame-component';
import { Anchor } from '../../types';
import { AnnotatedTextField } from '../AnnotatedTextField';

function _HighlightAnchor({ source }: Anchor) {
  const { document } = useFrame();
  const [target, setTarget] = useState<HTMLElement>();
  const [dom, setDOM] = useState<string>();

  // For highlight annotations, we extract the DOM and render it
  // within a separate editor to create interactivity.
  useEffect(() => {
    if (!document) {
      return;
    }

    const el = document.getElementById(source);
    if (el) {
      setTarget(el);
      setDOM(el.innerHTML);
      el.innerHTML = '';
    }
  }, [document, source]);

  if (!dom || !document) {
    return <></>;
  }

  if (!target) {
    return null;
  }

  return createPortal(
    <AnnotatedTextField name={source} content={dom} />,
    target
  );
}

export const HighlightAnchor = memo<Anchor>(_HighlightAnchor);
