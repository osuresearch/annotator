import React, { useRef, useLayoutEffect } from 'react';

export type AnchorProps = {
  name: string;
  children: React.ReactNode;
};

export const anchorPositions: Record<string, number> = {};

const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    const bounds = entry.boundingClientRect;
    console.log(entry.target.id, bounds);
  }

  // observer.disconnect();
});

/**
 * Position management for wiring comments to content
 */
export function Anchor({ name, children }: AnchorProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div id={name} ref={ref}>
      {children}
    </div>
  );
}
