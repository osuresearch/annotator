
import React, { useEffect, DOMAttributes, useRef } from 'react';

function useAnchoredContainers(target: HTMLElement, ref: React.RefObject<HTMLElement>) {

  const top = 0;

  useEffect(() => {

  }, [target, ref]);

  return {
    top,
  }
}
