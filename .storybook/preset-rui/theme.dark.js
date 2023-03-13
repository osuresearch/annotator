
import { create } from '@storybook/theming';

export default create({
  base: 'dark',

  colorPrimary: 'white',
  colorSecondary: '#26686d',

  // UI
  appBg: '#141517', // '#212325', // gray-shade-80
  appContentBg: '#141517', // black
  appBorderRadius: 0,

  // Typography
  fontBase: 'BuckeyeSans, HelveticaNeue, Helvetica, Arial, serif',
  fontCode: 'monospace',

  // Text colors
  textColor: 'white',
  textInverseColor: 'rgba(255,255,255,0.9)',

  // Toolbar default and active colors
  barTextColor: '#a7b1b7',
  barSelectedColor: '#ba0c2f',
  barBg: '#141517',

  // Form colors
  inputBg: '#212325', // gray-shade-80
  inputBorder: '#3f4443', // gray-shade-60
  inputTextColor: 'white',
  inputBorderRadius: 0,

  brandTitle: '@osuresearch/annotator',
  brandUrl: 'https://github.com/osuresearch/annotator',
  // brandImage: 'https://place-hold.it/350x150',
});
