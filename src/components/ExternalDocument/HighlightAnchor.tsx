import React, { memo, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useFrame } from 'react-frame-component';
import { Anchor } from '../../types';
import { AnnotatedTextField } from '../AnnotatedTextField';

const Portal = ({ el, children, replaceContent = true }: any) => {
  const target = useRef(el).current;
  const hasMounted = useRef(false);

  if (!target) return null;
  if (replaceContent && !hasMounted.current) {
    target.innerHTML = '';
    hasMounted.current = true;
  }

  return createPortal(children, target);
};

function _HighlightAnchor({ source }: Anchor) {
  const { document } = useFrame();
  const target = useRef(document?.getElementById(source)).current;
  const hasMounted = useRef(false);

  let dom = '';

  if (!target) return null;
  if (!hasMounted.current) {
    dom = target.innerHTML;
    // target.innerHTML = '';
    target.innerHTML = `<span aria-hidden="true" data-chase="LOOKATMEEEeee">${target.innerHTML}</span>`;

    hasMounted.current = true;
  }

  return createPortal(
    <AnnotatedTextField name={source} content={dom} />,
    target
  );
}

function _HighlightAnchor_old({ source }: Anchor) {
  const { document } = useFrame();
  const [target, setTarget] = useState<HTMLElement>();
  const dom = useRef('');
  const updateCount = useRef(0);

  // For highlight annotations, we extract the DOM and render it
  // within a separate editor to create interactivity.
  useEffect(() => {
    if (!document) {
      return;
    }

    const el = document.getElementById(source);
    if (!el) {
      console.warn('Missing element for highlight anchor', source);
      return;
    }

    if (target === el) {
      return;
    }

    setTarget(el);
    // setDOM(el.innerHTML);
    dom.current = `INSTANCE ${updateCount.current} - ` + el.innerHTML;
    updateCount.current++;

    // el.innerHTML = `<span aria-hidden="true" data-chase="LOOKATMEEEeee">${el.innerHTML}</span>`;
  }, [document, dom, target, source]);

  if (!target) {
    console.error('Missing target for highlight anchor', source);
    return null;
  }

  if (!dom) {
    console.warn('Missing dom for highlight anchor', source);
  }

  return (
    <Portal el={target}>
      hi! I am debug info for {source}!
      <AnnotatedTextField name={source} content={dom.current} />
    </Portal>
  )

  // return createPortal(
  //   <AnnotatedTextField name={source} content={dom.current} />,
  //   target
  // );
}

export const HighlightAnchor = memo<Anchor>(_HighlightAnchor);
