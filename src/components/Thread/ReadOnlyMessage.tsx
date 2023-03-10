import React from 'react';
import { Text } from '@osuresearch/ui';

export type ReadOnlyMessageProps = {
  message: string;
};

export function ReadOnlyMessage({ message }: ReadOnlyMessageProps) {
  // TODO: this a massive security problem if we can't assume the
  // server is sanitizing HTML comments. But instantiating too many tiptap
  // instances doesn't scale. Need a better solution here that also supports
  // the same DOM that Tiptap can generate. (Maybe using prosemirror directly?)
  return (
    <Text fs="sm">
      <span dangerouslySetInnerHTML={{ __html: message }} />
    </Text>
  );
}
