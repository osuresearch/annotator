import React, { CSSProperties } from 'react';

export type SampleProps = {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

/**
 * Sample documentation
 *
 * ## Accessibility
 * - Notes here
 */
export function Sample({ children, ...props }: SampleProps) {
  return <div {...props}>{children}</div>;
}
