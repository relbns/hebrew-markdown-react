import React from 'react';
import { EditorFromTextArea } from 'codemirror';
import {
  FaBold, FaItalic, FaStrikethrough, FaHeading, FaListUl, FaListOl,
  FaTasks, FaLink, FaImage, FaCode, FaQuoteRight, FaTable,
  FaSquareRootAlt, FaSuperscript, FaTrashAlt, FaSave, FaPrint,
} from 'react-icons/fa';
import classNames from 'classnames';

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
    const previewContent = document.querySelector('.hmr-preview-content');
    if (!previewContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const styles = Array.from(document.styleSheets)
      .map(s => `<link rel="stylesheet" href="${s.href}">`)
      .join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="he">
      <head>
        <meta charset="UTF-8">
        <title>Print</title>
        ${styles}
        <style>
          body { padding: 2rem; background: #fff; }
          .hmr-preview-content { max-width: 100%; }
        </style>
      </head>
      <body>
        <div class="hmr-preview-content">${previewContent.innerHTML}</div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  };

  const toolbarClasses = classNames('hmr-toolbar', { 'hmr-hidden': hidden });

  return (
    <div className={toolbarClasses}>
      <div className="hmr-tool-group">
        <button className="hmr-btn" onClick={handlers.bold} title="מודגש (Ctrl/Cmd+B)"><FaBold /></button>
        <button className="hmr-btn" onClick={handlers.italic} title="נטוי (Ctrl/Cmd+I)"><FaItalic /></button>
        <button className="hmr-btn" onClick={handlers.strike} title="קו חוצה"><FaStrikethrough /></button>
      </div>
      <div className="hmr-tool-divider" />
      <div className="hmr-tool-group">
        <button className="hmr-btn" onClick={handlers.h1} title="כותרת 1"><FaHeading />1</button>
        <button className="hmr-btn" onClick={handlers.h2} title="כותרת 2"><FaHeading style={{ fontSize: '0.9em' }} />2</button>
        <button className="hmr-btn" onClick={handlers.h3} title="כותרת 3"><FaHeading style={{ fontSize: '0.8em' }} />3</button>
      </div>
      <div className="hmr-tool-divider" />
      <div className="hmr-tool-group">
        <button className="hmr-btn" onClick={handlers.bulleted} title="רשימת תבליטים"><FaListUl /></button>
        <button className="hmr-btn" onClick={handlers.numbered} title="רשימה ממוספרת"><FaListOl /></button>
        <button className="hmr-btn" onClick={handlers.task} title="רשימת משימות"><FaTasks /></button>
      </div>
      <div className="hmr-tool-divider" />
      <div className="hmr-tool-group">
        <button className="hmr-btn" onClick={handlers.link} title="קישור (Ctrl/Cmd+K)"><FaLink /></button>
        <button className="hmr-btn" onClick={handlers.image} title="תמונה"><FaImage /></button>
        <button className="hmr-btn" onClick={handlers.codeInline} title="קוד"><FaCode /></button>
        <button className="hmr-btn" onClick={handlers.quote} title="ציטוט"><FaQuoteRight /></button>
      </div>
      <div className="hmr-tool-divider" />
      <div className="hmr-tool-group">
        <button className="hmr-btn" onClick={handlers.table} title="טבלה"><FaTable /></button>
        <button className="hmr-btn" onClick={handlers.mathInline} title="נוסחה מוטמעת ($)"><FaSquareRootAlt /></button>
        <button className="hmr-btn" onClick={handlers.mathBlock} title="נוסחה בבלוק ($$)"><FaSuperscript /></button>
      </div>
      <div className="hmr-tool-divider" />
      <div className="hmr-tool-group">
        <button className="hmr-btn" onClick={handlers.clear} title="נקה"><FaTrashAlt /></button>
        {onSave && <button className="hmr-btn" onClick={handlers.save} title="שמור"><FaSave /></button>}
        <button className="hmr-btn" onClick={handlePrint} title="הדפס תצוגה"><FaPrint /></button>
      </div>
    </div>
  );
};

export default Toolbar;
