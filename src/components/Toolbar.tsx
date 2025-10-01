import React from 'react';
import { EditorFromTextArea } from 'codemirror';
import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaHeading,
  FaListUl,
  FaListOl,
  FaTasks,
  FaLink,
  FaImage,
  FaCode,
  FaQuoteRight,
  FaTable,
  FaSquareRootAlt,
  FaSuperscript,
  FaTrashAlt,
  FaSave,
  FaPrint,
} from 'react-icons/fa';

interface ToolbarProps {
  editor: EditorFromTextArea | null;
  onSave?: (content: string) => void;
  hidden?: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ editor, onSave, hidden }) => {
  const run = (fn: (cm: EditorFromTextArea) => void) => {
    if (editor) fn(editor);
  };

  const insert = (before: string, after = '') =>
    run((cm) => {
      const sel = cm.getSelection();
      cm.replaceSelection(`${before}${sel || ''}${after}`);
      cm.focus();
    });

  const insertBlock = (text: string) => insert(text);

  const handlers = {
    bold: () => insert('**', '**'),
    italic: () => insert('*', '*'),
    strike: () => insert('~~', '~~'),
    h1: () => insertBlock('# '),
    h2: () => insertBlock('## '),
    h3: () => insertBlock('### '),
    bulleted: () => insertBlock('* '),
    numbered: () => insertBlock('1. '),
    task: () => insertBlock('- [ ] '),
    link: () => insert('[', '](http://example.com)'),
    image: () => insert('![', '](http://example.com/image.jpg)'),
    codeInline: () => insert('`', '`'),
    quote: () => insertBlock('> '),
    table: () =>
      insertBlock(
        '| כותרת 1 | כותרת 2 | כותרת 3 |\n| ------- | ------- | ------- |\n| תא 1 | תא 2 | תא 3 |\n'
      ),
    mathInline: () => insert('$', '$'),
    mathBlock: () => insert('$$\n', '\n$$'),
    clear: () => run((cm) => cm.setValue('')),
    save: () => run((cm) => onSave && onSave(cm.getValue())),
  };

  const handlePrint = () => {
    const previewContent = document.querySelector('.preview-content');

    if (!previewContent) {
      console.error('Preview content not found');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
    <!DOCTYPE html>
    <html dir="rtl" lang="he">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>הדפסה - Markdown RTL</title>
      
      <!-- KaTeX styles -->
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
      
      <style>
        /* Reset */
        *, *::before, *::after { 
          box-sizing: border-box; 
          margin: 0; 
          padding: 0; 
        }

        /* Variables - Light theme for print */
        :root {
          --background: #fff;
          --surface-1: #f7f9fc;
          --surface-2: #eef2f7;
          --card: #fff;
          --text-primary: #111;
          --text-secondary: #6b7280;
          --divider: #e5e7eb;
          --border: #e5e7eb;
          --primary: #2563eb;
          --primary-light: #e6f0ff;
          --fs-md: 1rem;
        }

        body {
          font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
          background: var(--background);
          color: var(--text-primary);
          line-height: 1.6;
          padding: 2cm;
          direction: rtl;
        }

        /* Preview content styles */
        .preview-content {
          max-width: 900px;
          margin: 0 auto;
          color: var(--text-primary);
          direction: rtl;
        }

        /* Headings */
        .preview-content h1 { 
          font-size: 1.75rem; 
          font-weight: 700; 
          margin: 0 0 .75rem; 
          border-bottom: 1px solid var(--divider); 
          padding-bottom: .25rem; 
        }

        .preview-content h2 { 
          font-size: 1.5rem; 
          font-weight: 600; 
          margin: 1rem 0 .5rem; 
        }

        .preview-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0.8rem 0 0.4rem;
        }

        /* Paragraphs and lists */
        .preview-content p { 
          margin: .5rem 0; 
        }

        .preview-content ul { 
          list-style: disc inside; 
          margin: .5rem 0 .5rem 1.25rem; 
        }

        .preview-content ol {
          list-style: decimal inside;
          margin: .5rem 0 .5rem 1.25rem;
        }

        .preview-content li {
          margin: 0.25rem 0;
        }

        /* Code */
        .preview-content code { 
          background: var(--surface-2); 
          padding: .2rem .4rem; 
          border-radius: 4px; 
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        }

        .preview-content pre {
          background: var(--surface-1); 
          direction: ltr !important; 
          text-align: left !important;
          padding: 1rem; 
          border-radius: 8px; 
          overflow: auto; 
          margin: 1rem 0; 
          box-shadow: 0 1px 2px rgba(0,0,0,.04);
        }

        .preview-content pre code {
          background: none;
          padding: 0;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        /* Tables */
        .preview-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.25rem 0;
          border: 1px solid var(--border);
          border-radius: 8px;
          overflow: hidden;
        }

        .preview-content thead tr {
          background: var(--surface-2);
          font-weight: 600;
          color: var(--text-primary);
        }

        .preview-content th,
        .preview-content td {
          border: 1px solid var(--divider);
          padding: .7rem 1rem;
          text-align: right;
        }

        .preview-content tbody tr:nth-child(odd) {
          background: var(--card);
        }

        .preview-content tbody tr:nth-child(even) {
          background: var(--surface-1);
        }

        /* Blockquotes */
        .preview-content blockquote {
          border-right: 4px solid var(--primary);
          background: var(--surface-1);
          margin: 1rem 0;
          padding: .8rem 1.2rem;
          border-radius: 8px;
          font-style: italic;
        }

        /* KaTeX - Math equations */
        .katex {
          direction: ltr !important;
          text-align: left !important;
          unicode-bidi: isolate !important;
        }

        /* Inline math - blue */
        .preview-content .katex {
          color: var(--primary);
          font-weight: 500;
        }

        /* Block math - centered in card */
        .preview-content .katex-display {
          display: flex;
          justify-content: center;
          padding: 1.2rem;
          margin: 1.5rem 0;
          background: var(--surface-1);
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
        }

        /* Links */
        a {
          color: var(--primary);
          text-decoration: underline;
        }

        /* Strong and emphasis */
        strong {
          font-weight: bold;
        }

        em {
          font-style: italic;
        }

        /* Print specific */
        @media print {
          body {
            padding: 0;
          }

          @page {
            margin: 2cm;
          }

          h1, h2, h3 {
            break-after: avoid;
            page-break-after: avoid;
          }

          table, pre, blockquote {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .katex-display {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="preview-content">
        ${previewContent.innerHTML}
      </div>
    </body>
    </html>
  `);

    printWindow.document.close();

    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500); // Increased timeout for KaTeX rendering
    };
  };

  return (
    <div className={`toolbar${hidden ? ' hidden' : ''}`}>
      <div className="tool-group">
        <button
          className="btn"
          onClick={handlers.bold}
          title="מודגש (Ctrl/Cmd+B)"
        >
          <FaBold />
          <span className="tooltip">מודגש</span>
        </button>
        <button
          className="btn"
          onClick={handlers.italic}
          title="נטוי (Ctrl/Cmd+I)"
        >
          <FaItalic />
          <span className="tooltip">נטוי</span>
        </button>
        <button className="btn" onClick={handlers.strike} title="קו חוצה">
          <FaStrikethrough />
          <span className="tooltip">קו חוצה</span>
        </button>
      </div>

      <div className="tool-divider" />

      <div className="tool-group">
        <button className="btn" onClick={handlers.h1} title="כותרת 1">
          <FaHeading />1
        </button>
        <button className="btn" onClick={handlers.h2} title="כותרת 2">
          <FaHeading style={{ fontSize: '0.9em' }} />2
        </button>
        <button className="btn" onClick={handlers.h3} title="כותרת 3">
          <FaHeading style={{ fontSize: '0.8em' }} />3
        </button>
      </div>

      <div className="tool-divider" />

      <div className="tool-group">
        <button
          className="btn"
          onClick={handlers.bulleted}
          title="רשימת תבליטים"
        >
          <FaListUl />
        </button>
        <button
          className="btn"
          onClick={handlers.numbered}
          title="רשימה ממוספרת"
        >
          <FaListOl />
        </button>
        <button className="btn" onClick={handlers.task} title="רשימת משימות">
          <FaTasks />
        </button>
      </div>

      <div className="tool-divider" />

      <div className="tool-group">
        <button
          className="btn"
          onClick={handlers.link}
          title="קישור (Ctrl/Cmd+K)"
        >
          <FaLink />
        </button>
        <button className="btn" onClick={handlers.image} title="תמונה">
          <FaImage />
        </button>
        <button className="btn" onClick={handlers.codeInline} title="קוד">
          <FaCode />
        </button>
        <button className="btn" onClick={handlers.quote} title="ציטוט">
          <FaQuoteRight />
        </button>
      </div>

      <div className="tool-divider" />

      <div className="tool-group">
        <button className="btn" onClick={handlers.table} title="טבלה">
          <FaTable />
        </button>
        <button
          className="btn"
          onClick={handlers.mathInline}
          title="נוסחה מוטמעת ($)"
        >
          <FaSquareRootAlt />
        </button>
        <button
          className="btn"
          onClick={handlers.mathBlock}
          title="נוסחה בבלוק ($$)"
        >
          <FaSuperscript />
        </button>
      </div>

      <div className="tool-divider" />

      <div className="tool-group">
        <button className="btn" onClick={handlers.clear} title="נקה">
          <FaTrashAlt />
        </button>
        <button className="btn" onClick={handlers.save} title="שמור">
          <FaSave />
        </button>
        <button className="btn" onClick={handlePrint} title="הדפס תצוגה">
          <FaPrint />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
