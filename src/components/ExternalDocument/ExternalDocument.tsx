import { Code, Group, Heading, Stack } from '@osuresearch/ui';
import React from 'react';
import Frame from 'react-frame-component';

import { Annotations } from '../Annotations';
import { Controller } from './Controller';

// Styles to inject into the inner iframe
// TODO: I hate this. Better solution?
// I don't want to lock consumers into styled-components or similar.
const STYLES = `
  comment-view[data-comment] {
    background-color: yellow;
  }

  comment-focus-view[data-comment] {
    background-color: gold;
    text-decoration: underline;
  }
`;

export type ExternalDocumentProps = {
  /**
   * DOM content to render as a reviewable document.
   *
   * This cannot be changed once the component has mounted.
   */
  content: string;
};

/**
 * Container for a reviewable document that was generated through
 * an external HTML renderer.
 *
 * Document content is rendered within a controlled iframe
 * and tagged elements are converted into controlled React
 * components through a portal.
 *
 * ## 📖 Storybook Dev Mode
 *
 * Note that running this in Storybook dev mode may occasionally break
 * due to hot reloading. The component is built to be mounted once.
 */
export function ExternalDocument(props: ExternalDocumentProps) {
  return (
    <Group h="800px" grow>
      <Frame height="100%" initialContent={props.content} head={<style>{STYLES}</style>}>
        <Controller />
      </Frame>
      <Stack
        align="stretch"
        maw={400}
        mah="100%"
        style={{ overflowY: 'scroll', overflowX: 'hidden' }}
      >
        <Annotations />
      </Stack>
    </Group>
  );
}
