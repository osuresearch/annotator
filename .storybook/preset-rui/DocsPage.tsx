import React, { useContext } from 'react';
import {
  Title,
  Subtitle,
  Description,
  Primary,
  ArgsTable,
  Stories,
  PRIMARY_STORY,
  DocsContext,
} from '@storybook/addon-docs';
import { Code, Heading, Item, Space, Stack, TabPanel, Text } from '@osuresearch/ui';


export const DocsPage = () => {
  const context = useContext(DocsContext);
  const story = context.storyById();

  const path = story.title.split('/');
  const name = path[path.length - 1].trim();

  let parent = 'root';
  if (path.length > 1) {
    parent = path[path.length - 2].toLowerCase().trim();
  }

  const isComponent = story.component !== undefined
    && (story.component as any).__docgenInfo !== undefined;

  const hasAdditionalStories = context.componentStories().length > 1;

  return (
    <Stack gap={0} align="stretch">
      <Heading className="sb-unstyled" level={1}>{name}</Heading>
      <Stack>
        <Code>
          import &#123; {name} &#125; from '@osuresearch/annotator'
        </Code>
      </Stack>

      <Description />

      <Primary />

      {hasAdditionalStories &&
        <TabPanel variant="simple" align="stretch">
          <Item key="props" title="Props">
            <Space />
            <ArgsTable story={PRIMARY_STORY} />
          </Item>
          <Item key="examples" title="Examples">
            <Space h="xl" />
            <Stories title="Examples" includePrimary={false} />
          </Item>
        </TabPanel>
      }

      {!hasAdditionalStories &&
        <ArgsTable story={PRIMARY_STORY} />
      }
    </Stack>
  )
};
