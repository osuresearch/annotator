
function config(entry = []) {
  return [...entry, require.resolve("./preview")];
}

function managerEntries(entry = []) {
  return [...entry, require.resolve("./manager")];
}

module.exports = {
  // Addons that we typically use alongside RUI
  // addons: [
  //   [
  //     "@storybook/addon-links",
  //     "@storybook/addon-essentials",
  //     "@storybook/addon-interactions",
  //     "storybook-dark-mode"
  //   ]
  // ],
  managerEntries,
  config,

  // note that these addon updates don't happen live.
  // previewHead: (head) => (`
  //   ${head}
  //   <style>
  //     body {
  //       background-color: yellow;
  //     }
  //   </style>
  // `)
};
