# hebrew-markdown-react

React wrapper for the [Hebrew Markdown Editor](https://github.com/Dor-sketch/hebrew-markdown)  
A modern, RTL-friendly Markdown editor with live preview, math rendering, and Apple-inspired design — now as a reusable React component.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Based on Dor Pascal's Project](https://img.shields.io/badge/Based%20on-Hebrew%20Markdown%20Editor-blueviolet)](https://github.com/Dor-sketch/hebrew-markdown)

---

## ✨ Features

- ✅ Full Hebrew (RTL) support
- ✅ Live Markdown preview
- ✅ Toolbar with formatting actions
- ✅ Multiple view modes (editor / preview / split)
- ✅ Theme selection + Dark/Light mode
- ✅ Math expressions with **KaTeX**
- ✅ Syntax highlighting for code blocks
- ✅ Word & character count
- ✅ Export as `.md`

---

## 📦 Installation

```bash
npm install hebrew-markdown-react
```

Peer dependencies (make sure you already have these installed):

```bash
npm install react react-dom
```

---

## 🚀 Usage

```tsx
import { HebrewMarkdownEditor } from "hebrew-markdown-react";
import { useState } from "react";

export default function App() {
  const [value, setValue] = useState("# שלום עולם 👋");

  return (
    <HebrewMarkdownEditor
      value={value}
      onChange={(val) => setValue(val)}
    />
  );
}
```

---

## Development

- Requires Node.js **20.19.0** (see `.nvmrc`) or higher
```bash
nvm use
```

- Install dependencies:
```bash
  npm install
```

---

## 📖 Storybook

Run Storybook locally to explore and play with the editor:

```bash
npm run storybook
```

---

## 📃 License

This project is licensed under the MIT License.
See the [LICENSE](LICENSE) file for details.

---

## 👤 Authors

* [Dor Pascal](https://dorpascal.com) – Creator of the original [Hebrew Markdown Editor](https://github.com/Dor-sketch/hebrew-markdown)
* [Ariel Benesh](https://github.com/relbns) – Creator of the React wrapper (`hebrew-markdown-react`)
