import React from 'react';
import { Meta, StoryObj } from '@storybook/react';

import { Screenshot } from './Screenshot';
import { AnnotationsProvider } from '../AnnotationsProvider';

const meta: Meta<typeof Screenshot> = {
  title: 'Components/Screenshot',
  component: Screenshot,
  argTypes: {}
};

export default meta;

type Story = StoryObj<typeof Screenshot>;

const demoAgent: AnnotationAgent = {
  type: 'Person',
  id: '0123456',
  name: 'Chase',
  email: 'mcmanning.1@osu.edu',
  nickname: 'mcmanning.1'
};

export const Simple: Story = {
  render: (args) => (
    <AnnotationsProvider agent={demoAgent} role="A11Y Reviewer">
      <Screenshot {...args} />
    </AnnotationsProvider>
  ),
  args: {

  }
}
