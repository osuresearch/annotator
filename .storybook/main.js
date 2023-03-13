// const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const path = require('path');

module.exports = {
  stories: [
    '../@(src|docs)/**/*.mdx',
    '../@(src|docs)/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  staticDirs: ['../docs/diagrams'],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "storybook-dark-mode",
    require.resolve('./preset-rui'),
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {}
  },
  docs: {
    autodocs: true
  },
};
