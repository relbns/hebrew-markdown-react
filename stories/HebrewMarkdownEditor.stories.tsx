import type { Meta, StoryObj } from "@storybook/react";
import { HebrewMarkdownEditor } from "../src";

// 🔹 ה־Meta מגדיר את הקומפוננטה ואת השליטה ב־Controls
const meta: Meta<typeof HebrewMarkdownEditor> = {
  title: "HebrewMarkdown/Editor",
  component: HebrewMarkdownEditor,
  parameters: { layout: "fullscreen" },
  argTypes: {
    value: { control: "text" },
    showCredits: { control: "boolean" },
    onSave: { action: "onSave" },
    onChange: { action: "onChange" },
  },
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

## קוד מקור

\`\`\`javascript
// דוגמת קוד בג'אווהסקריפט
function hello() {
    console.log("שלום עולם!");
    return true;
}

// טיפול באירועים
document.addEventListener('click', function() {
    const message = "נלחץ כפתור!";
    console.log(message);
});
\`\`\`

## טבלאות

| שם      | גיל | עיר         |
|---------|-----|-------------|
| ישראל   | 30  | תל אביב     |
| שרה     | 25  | ירושלים     |
| דוד     | 40  | חיפה        |

## רשימת משימות

- [x] עיצוב מודרני
- [x] תמיכה בנוסחאות מתמטיות
- [x] עימוד קוד
- [ ] ייצוא ל-PDF
- [ ] תמיכה בתמונות מקומיות

נסה לערוך את הטקסט ולראות את התצוגה המקדימה בזמן אמת!
`;

// 🔹 סטורי יחיד – הכל דרך controls
export const Playground: Story = {
  args: {
    value: demoMarkdown,
    showCredits: true,
    onSave: (val: string) => {
      navigator.clipboard
        .writeText(val)
        .then(() => alert("✅ Copied to clipboard:\n\n" + val))
        .catch(() => alert("❌ Failed to copy"));
    },
    onChange: (val: string) => console.log("changed:", val),
  },
};
