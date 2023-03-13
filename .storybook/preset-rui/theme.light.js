
import { create } from '@storybook/theming';

export default create({
  base: 'light',

  colorPrimary: '#26686d',

  // Secondary drives link colors, input outlines, hover color for buttons,
  // active underline colors,
  colorSecondary: '#ba0c2f', // scarlet, or teal is good #26686d

  // UI
  appBg: '#ffffff', // f6f7f8 gray-tint-90
  appContentBg: '#ffffff',
  appBorderRadius: 0,

  // Typography
  fontBase: 'BuckeyeSans, HelveticaNeue, Helvetica, Arial, serif',
  fontCode: 'monospace',

  // Text colors
  textColor: '#141517', // black
  textInverseColor: 'rgba(255,255,255,0.9)',

  // Toolbar default and active colors
  barTextColor: '#212325',
  barSelectedColor: '#ba0c2f', // scarlet
  barBg: '#ffffff',

  // Form colors
  inputBg: '#ffffff',
  inputBorder: '#eff1f2', // gray-tint-80
  inputTextColor: '#141517', // black
  inputBorderRadius: 0,

  brandTitle: '@osuresearch/annotator',
  brandUrl: 'https://github.com/osuresearch/annotator',
  // brandImage: 'https://place-hold.it/350x150',
});
