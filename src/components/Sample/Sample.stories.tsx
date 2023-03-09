import React from 'react';
import { Meta, StoryObj } from '@storybook/react';

import { Sample } from './Sample';

const meta: Meta<typeof Sample> = {
  title: 'Components/Sample',
  component: Sample,
  argTypes: {}
};

export default meta;

type Story = StoryObj<typeof Sample>;

export const Overview: Story = {
  args: {}
};
