import React from 'react';
import { addons } from '@storybook/manager-api';
import theme from './theme.light';

// export const ADDON_ID = 'storybook/source-loader';
// export const PANEL_ID = `${ADDON_ID}/panel`;

// addons.register(ADDON_ID, (api) => {
//   addons.addPanel(PANEL_ID, {
//     title: 'RUI',
//     render: ({ active, key }) => (active ? <div key={key} api={api} /> : null),
//     paramKey: 'rui',
//   });
// });

addons.setConfig({
  theme
});
