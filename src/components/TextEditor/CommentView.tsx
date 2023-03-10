import React from 'react';
import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';

export function CommentView() {
  return (
    <NodeViewWrapper className="comment-view">
      <span className="label">React Component</span>

      <div className="content">hi</div>
    </NodeViewWrapper>
  );
}
