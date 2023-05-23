import React from 'react';
import { useDarkMode } from 'storybook-dark-mode';
import { RUIProvider } from '@osuresearch/ui';
import { DocsContainer } from './DocsContainer';
import { DocsPage } from './DocsPage';

import light from './theme.light';
import dark from './theme.dark';

export const parameters = {
  docs: {
    container: DocsContainer,
    page: DocsPage,
  },

  // Don't add a second background color button.
  // We have a global dark mode toggle
  backgrounds: {
    disable: true,
  },

  // Override dark and light modes with a custom theme
  darkMode: {
    dark,
    light,
  },
};

// Wrap preview iframe with RUI's provider
export const decorators = [
  (Story) => (
    <React.StrictMode>
      <RUIProvider theme={useDarkMode() ? 'dark' : 'light'}>
        <Story />
      </RUIProvider>
    </React.StrictMode>
  ),
];
