import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useFrame } from 'react-frame-component';

type SectionAnchorProps = {
  el: HTMLElement;
  id: string;
  title: string;
  level: number;
};

type SectionListProps = {
  el?: HTMLDivElement;
  anchors: SectionAnchorProps[];
};

function SectionList({ el, anchors }: SectionListProps) {
  if (!el) {
    return null;
  }

  // Since sections are within iframes, we need to control
  // scroll and focus behaviour.
  const onClickSection = (target: HTMLElement) => {
    target.scrollIntoView();
    target.focus();
  };

  return createPortal(
    <div>
      TODO: TOC injection may happen in the root DOM and not injected into the iframe. Not a fan of
      this technique currently.
      <ol>
        {anchors.map((props) => (
          <li key={props.id}>
            <button
              style={{
                marginLeft: props.level * 16
              }}
              onClick={(e) => onClickSection(props.el)}
            >
              {props.title}
            </button>
          </li>
        ))}
      </ol>
    </div>,
    el
  );
}

/**
 * Anchors that denote the beginning of a document section.
 *
 * These are programmatically scrolled to and focused when a button
 * is clicked in the table of contents.
 */
// function SectionAnchor({ title, id, el }: SectionAnchorProps) {
//   return createPortal(
//     <div
//       id={id}
//       tabIndex={-1}
//       style={{ visibility: 'hidden' }}>{title}
//     </div>,
//     el
//   );
// }

export function TableOfContents() {
  const { document } = useFrame();
  const [anchors, setAnchors] = useState<SectionAnchorProps[]>([]);
  const [container, setContainer] = useState<HTMLDivElement>();

  // Throw portals into all the anchor targets
  useEffect(() => {
    if (!document) {
      return;
    }

    const anchorProps: SectionAnchorProps[] = [];

    document.querySelectorAll<HTMLElement>('[data-comment-section]').forEach((el) => {
      anchorProps.push({
        el,
        id: el.id,
        title: el.dataset.commentSection ?? el.id,
        level: parseInt(el.dataset.commentSectionLevel ?? '0')
      });

      // Make the section programmatically focusable
      // for use with the table of contents buttons.
      el.tabIndex = -1;
    });

    setAnchors(anchorProps);

    // Add a prepended container for TOC content.
    // This is a bit non-standard because I want to inject this
    // *before* any DOM content within the source document.
    const container = document.createElement('div');
    document.body.prepend(container);
    setContainer(container);

    return () => {
      document.body.removeChild(container);
      setContainer(undefined);
    };
  }, [document]);

  // Each section is portaled into its respective container
  return (
    <>
      <SectionList el={container} anchors={anchors} />
      {/* {anchors.map((anchorProps) => <SectionAnchor {...anchorProps} />)} */}
    </>
  );
}
