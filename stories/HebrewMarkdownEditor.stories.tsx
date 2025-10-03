import type { Meta, StoryObj } from "@storybook/react";
import { HebrewMarkdownEditor } from "../src";
import './custom.css';

const meta: Meta<typeof HebrewMarkdownEditor> = {
  title: "HebrewMarkdown/Editor",
  component: HebrewMarkdownEditor,
  parameters: { layout: "fullscreen" },
  argTypes: {
    value: { control: "text" },
    height: { control: "text" },
    className: { control: "text" },
    showCredits: { control: "boolean" },
    onSave: { action: "onSave" },
    onChange: { action: "onChange" },
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof HebrewMarkdownEditor>;

const demoMarkdown = `# עורך Markdown Right-to-Left (RTL)

ברוך הבא לעורך Markdown המודרני בעברית. עורך זה תומך בכל תכונות Markdown ובנוסחאות מתמטיות, עם ממשק מינימליסטי בהשראת מוצרי Apple.

## תכונות המערכת

* עיצוב נקי ומודרני בהשראת מוצרי Apple
* תמיכה מלאה בעברית (RTL)
* עיצוב טקסט **מודגש**, *נטוי* ו~~קו חוצה~~
* תמיכה ברשימות ממוספרות ולא ממוספרות
* אפשרות להוספת [קישורים](https://dorpascal.com) ותמונות
* תחביר קוד עם הדגשת תחביר
* מצב כהה ובהיר עם מגוון ערכות נושא לעורך

## תמיכה בנוסחאות מתמטיות

ניתן להשתמש בנוסחאות מתמטיות בתוך השורה כמו $E = mc^2$ או בתור בלוק:

$$
\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}
$$
`;

export const Default: Story = {
  args: {
    value: demoMarkdown,
    onSave: (val: string) => alert(`Saved content:\n\n${val}`),
  },
};

export const FixedHeight: Story = {
  args: {
    ...Default.args,
    height: '500px',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '1rem' }}>
        <h2>Editor with fixed height (500px)</h2>
        <div style={{ border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
          <Story />
        </div>
      </div>
    ),
  ],
};

export const CustomStyled: Story = {
  args: {
    ...Default.args,
    className: 'custom-editor-theme',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '1rem' }}>
        <h2>Editor with Custom Styling</h2>
        <p>This editor has a custom theme applied via the <code>className</code> prop.</p>
        <div style={{ border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
          <Story />
        </div>
      </div>
    ),
  ],
};
