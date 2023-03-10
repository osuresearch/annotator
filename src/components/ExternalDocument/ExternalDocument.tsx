import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Code, Group, Heading, Paper, Stack } from '@osuresearch/ui';
import Frame from 'react-frame-component';
import styled from 'styled-components';

import { Annotations } from '../Annotations';
import { Controller } from './Controller';
import { TableOfContents } from './TableOfContents';
import { SelectionActions } from './SelectionActions';

import { useAnchors, Context } from '../../hooks/useAnchors';

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

const PageLayout = styled.div`
  // A4 page size
  /* min-width: 21cm; */
  /* height: 29.7cm;
  margin: 30mm 45mm 30mm 45mm; */
  display: flex;
  flex-direction: row;

  border: 1px solid red;
`;

const A4Page = styled.div`
  border: 1px solid green;
  background: #fff;

  min-width: 21cm;
  width: 21cm;
  padding: 64px;
`;

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
  const frameRef = useRef<HTMLIFrameElement>(null);
  const annotationsRef = useRef<HTMLDivElement>(null);

  // Sync scroll positions between the frame and annotations aside.
  // TODO: This isn't particularly performant (or smart) but I don't
  // want the annotations inside the frame without a scoped CSS reset.
  // Any other ideas?
  useEffect(() => {
    if (!frameRef.current) {
      return;
    }

    // Since we control iframe content, we don't need a complex
    // postmessage/receive message solution. Can just monitor iframe height directly.
    // It is a bit too frequent since I'm using animation frames, but
    // it may not be an actual problem. Will need to benchmark.

    let handle: number;
    let prev = 0;

    const watch = () => {
      const container = frameRef.current?.contentWindow?.document.body;

      cancelAnimationFrame(handle);

      if (container && prev !== container.scrollHeight) {
        prev = container.scrollHeight;
        console.log('resize', prev);
        frameRef.current.height = prev + 64 + 'px';
      }

      handle = requestAnimationFrame(watch);
    };

    handle = requestAnimationFrame(watch);
    return () => cancelAnimationFrame(handle);
  }, [frameRef, annotationsRef]);

  // useImperativeHandle(forwardRef, () => ({
  //   resize: () => iframeRef.current.iFrameResizer.resize(),
  //   moveToAnchor: (anchor) =>
  //     iframeRef.current.iFrameResizer.moveToAnchor(anchor),
  //   sendMessage: (message, targetOrigin) => {
  //     iframeRef.current.iFrameResizer.sendMessage(message, targetOrigin)
  //   },
  // }));

  const [document, setDocument] = useState<Document>();

  const onContentMount = () => {
    setDocument(frameRef.current?.contentWindow?.document);
  };

  const ctx = useAnchors();

  return (
    <Context.Provider value={ctx}>
      <Group bgc="light" justify="center" miw="calc(21cm + 400px)" py="md">
        {document && <TableOfContents document={document} />}
        <Paper w="21cm" miw="21cm" p="xxl" withBorder shadow="md" ml="xxl">
          <Frame
            ref={frameRef}
            initialContent={props.content}
            head={<style>{STYLES}</style>}
            style={{
              width: '100%',
              margin: 0
            }}
            contentDidMount={onContentMount}
          >
            <Controller />
          </Frame>

          <SelectionActions />
        </Paper>
        <Stack align="stretch" w={400} miw={400}>
          <Annotations ref={annotationsRef} />
        </Stack>
      </Group>
    </Context.Provider>
  );
}
