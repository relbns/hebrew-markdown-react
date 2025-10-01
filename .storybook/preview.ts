import type { Preview } from "@storybook/react";

const preview: Preview = {
  parameters: {
    layout: "fullscreen",
    options: {
      storySort: {
        order: ["HebrewMarkdownEditor"],
      },
    },
  },
  globals: {
    direction: "rtl", // RTL already
  },
};

export default preview;
