import React, { useEffect, useState } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { DocsContainer as BaseContainer, DocsContainerProps } from '@storybook/blocks';
import { themes } from '@storybook/theming';
import { useDarkMode } from 'storybook-dark-mode';
import { Heading, RUIProvider } from '@osuresearch/ui';

import '@osuresearch/ui/dist/index.css';

function isDarkInStorage(): boolean {
  const themeString = localStorage.getItem('sb-addon-themes-3');

  if (themeString) {
    const theme = JSON.parse(themeString);

    return theme['current'] !== 'light';
  }

  return false;
}

/**
 * Wrap Storybook v7 docs with the RUI style system
 */
export const DocsContainer = (props: DocsContainerProps<any>) => {
  // storybook-dark-mode compatibility fix for Storybook v7
  // ref: https://github.com/hipstersmoothie/storybook-dark-mode/issues/127#issuecomment-1369228348
  const [isDark, setIsDark] = useState(isDarkInStorage());

  const handler = () => {
    setIsDark(isDarkInStorage());
  };

  useEffect(() => {
    window.addEventListener('storage', handler);

    return function cleanup() {
      window.removeEventListener('storage', handler);
    };
  });

  return (
    <RUIProvider theme={isDark ? 'dark' : 'light'}>
      <MDXProvider
        components={{
          h1: ({ children }) => <Heading level={1}>{children}</Heading>,
          h2: ({ children }) => <Heading level={2}>{children}</Heading>
          // h1: DesignSystem.H1,
          // h2: DesignSystem.H2,
        }}
      >
        <BaseContainer {...props} theme={isDark ? themes.dark : themes.light} />
      </MDXProvider>
    </RUIProvider>
  );
};
