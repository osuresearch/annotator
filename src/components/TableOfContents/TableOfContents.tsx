import { Button, Icon, IconButton, Stack, ToggleButton } from '@osuresearch/ui';
import React, { useEffect, useState } from 'react';

type SectionAnchorProps = {
  el: HTMLElement;
  id: string;
  title: string;
  level: number;
};

type SectionListProps = {
  anchors: SectionAnchorProps[];
};

function SectionList({ anchors }: SectionListProps) {
  // Since sections are within iframes, we need to control
  // scroll and focus behaviour.
  const onClickSection = (target: HTMLElement) => {
    target.scrollIntoView();
    target.focus();
  };

  return (
    <div>
      <ol>
        {anchors.map((props) => (
          <li key={props.id}>
            <Button
              variant="subtle"
              style={{
                marginLeft: props.level * 16
              }}
              onPress={(e) => onClickSection(props.el)}
            >
              {props.title.substring(0, 50)}
            </Button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export type TableOfContentsProps = {
  /**
   * The DOM Document to extract a table of contents from.
   *
   * This may either be an iframed document or a
   * live React document.
   */
  document?: Document;
};

export function TableOfContents({ document }: TableOfContentsProps) {
  const [anchors, setAnchors] = useState<SectionAnchorProps[]>([]);

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

    console.log('sections', anchorProps);

    setAnchors(anchorProps);
  }, [document]);

  const [open, setOpen] = useState(false);

  return (
    <Stack>
      <IconButton label="Toggle table of contents" variant="fade" name="bars"
        onPress={() => setOpen(!open)}
      />

      {open && <SectionList anchors={anchors} />}
    </Stack>
  );
}
