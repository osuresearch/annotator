import React from 'react';
import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';

function CommentView() {
  return (
    <NodeViewWrapper className="comment-view">
      <span className="label">React Component</span>

      <div className="content">hi</div>
    </NodeViewWrapper>
  );
}

export default Node.create({
  name: 'commentView',
  atom: true,

  renderHTML({ HTMLAttributes }) {
    return ['react-component', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CommentView);
  }
});
