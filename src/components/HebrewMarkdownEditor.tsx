import React, { useEffect, useRef, useState } from 'react';
import CodeMirror from 'codemirror';

import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/addon/edit/continuelist';
import 'codemirror/addon/search/search';
import 'codemirror/addon/search/searchcursor';
import 'codemirror/addon/dialog/dialog.css';
import 'codemirror/addon/dialog/dialog';

import DOMPurify from 'dompurify';
import { marked } from 'marked';
import katex from 'katex';
import 'katex/dist/katex.min.css';

import '../styles/editor.css';

import Header, { ViewMode } from './Header';
import Toolbar from './Toolbar';
import Preview from './Preview';
import StatusBar from './StatusBar';
import { FaEye, FaCode } from 'react-icons/fa';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css'; // אפשר לבחור theme אחר

interface HebrewMarkdownEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  onSave?: (content: string) => void;
  showCredits?: boolean;
}

export const HebrewMarkdownEditor: React.FC<HebrewMarkdownEditorProps> = ({
  value,
  onChange,
  onSave,
  showCredits = true,
}) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [editor, setEditor] = useState<CodeMirror.EditorFromTextArea | null>(
    null
  );
  const [content, setContent] = useState<string>(value || '');
  const [previewHtml, setPreviewHtml] = useState<{ __html: string }>({
    __html: '',
  });

  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [toolbarVisible, setToolbarVisible] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [searchMode, setSearchMode] = useState<'find' | 'replace' | null>(null);

  // ----- Editor init -----
  useEffect(() => {
    if (!editorRef.current || editor) return;

    // Custom overlay for simple math/code tagging (optional)
    const cm = CodeMirror.fromTextArea(editorRef.current, {
      mode: 'markdown',
      lineWrapping: true,
      direction: 'rtl',
      rtlMoveVisually: true,
      viewportMargin: Infinity,
      extraKeys: {
        Enter: 'newlineAndIndentContinueMarkdownList',
        'Ctrl-F': 'find',
        'Cmd-F': 'find',
        'Ctrl-H': 'replace',
        'Cmd-H': 'replace',
        'Ctrl-B': () => wrap('**', '**'),
        'Cmd-B': () => wrap('**', '**'),
        'Ctrl-I': () => wrap('*', '*'),
        'Cmd-I': () => wrap('*', '*'),
        'Ctrl-K': () => wrap('[', '](http://example.com)'),
        'Cmd-K': () => wrap('[', '](http://example.com)'),
        'Ctrl-S': () => onSave && onSave(cm.getValue()),
        'Cmd-S': () => onSave && onSave(cm.getValue()),
      },
    });

    const wrap = (before: string, after = '') => {
      const sel = cm.getSelection();
      cm.replaceSelection(`${before}${sel || ''}${after}`);
      cm.focus();
    };

    cm.on('change', () => {
      const val = cm.getValue();
      setContent(val);
      onChange?.(val);
    });

    setEditor(cm);
    if (value !== undefined) cm.setValue(value);
    else
      cm.setValue(
        `# ברוך הבא!\n\nכתוב כאן Markdown בעברית.\n\n* תמיכה מלאה ב-RTL\n* כותרות, רשימות, קישורים ועוד\n\n\`\`\`js\nconsole.log("שלום עולם")\n\`\`\`\n`
      );
  }, [editor, onChange, onSave, value]);

  // sync external value
  useEffect(() => {
    if (editor && value !== undefined && value !== content)
      editor.setValue(value);
  }, [value, editor]); // deliberately ignore content

  // הוספה של renderer מותאם אישית
  marked.use({
    renderer: {
      code({ text, lang }) {
        if (lang && hljs.getLanguage(lang)) {
          const highlighted = hljs.highlight(text, { language: lang }).value;
          return `<pre><code class="hljs language-${lang}">${highlighted}</code></pre>`;
        }
        const highlighted = hljs.highlightAuto(text).value;
        return `<pre><code class="hljs">${highlighted}</code></pre>`;
      },
    },
  });

  // ----- Preview render -----
  useEffect(() => {
    const render = async () => {
      let html = await marked.parse(content || '');

      // KaTeX math
      html = html
        .replace(/\$\$([\s\S]*?)\$\$/g, (_, eq) =>
          katex.renderToString(eq, { displayMode: true, throwOnError: false })
        )
        .replace(/\$([^\$]+)\$/g, (_, eq) =>
          katex.renderToString(eq, { displayMode: false, throwOnError: false })
        );

      setPreviewHtml({ __html: DOMPurify.sanitize(html) });
    };
    render();
  }, [content]);

  // ----- resizable divider -----
  useEffect(() => {
    const divider = document.querySelector('.divider') as HTMLDivElement | null;
    const container = document.querySelector(
      '.app-container'
    ) as HTMLDivElement | null;
    const editorPanel = document.querySelector(
      '.editor-panel'
    ) as HTMLDivElement | null;

    if (!divider || !container || !editorPanel) return;

    let isResizing = false;
    let startX = 0;
    let startWidth = 0;

    const onDown = (e: MouseEvent) => {
      if (viewMode !== 'split') return;
      isResizing = true;
      startX = e.clientX;
      startWidth = editorPanel.getBoundingClientRect().width;
      container.classList.add('resizing');
      document.body.style.userSelect = 'none';
    };
    const onMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const dx = e.clientX - startX;
      const containerWidth = container.clientWidth;
      const newWidth = startWidth + dx; // RTL
      const pct = Math.min(Math.max((newWidth / containerWidth) * 100, 20), 80);
      document.documentElement.style.setProperty('--editor-width', `${pct}%`);
      document.documentElement.style.setProperty(
        '--preview-width',
        `${100 - pct}%`
      );
      editor?.refresh();
    };
    const onUp = () => {
      isResizing = false;
      container.classList.remove('resizing');
      document.body.style.userSelect = '';
      editor?.refresh();
    };

    divider.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    return () => {
      divider.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [viewMode, editor]);

  // ----- dark mode -----
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
    // force refresh (scrollbars/colors)
    setTimeout(() => editor?.refresh(), 0);
  }, [darkMode, editor]);

  // search toggle
  const toggleFind = () => {
    if (!editor) return;
    if (searchMode === 'find') {
      setSearchMode(null);
      (editor as any).execCommand('clearSearch');
    } else {
      setSearchMode('find');
      (editor as any).execCommand('find');
    }
  };
  const toggleReplace = () => {
    if (!editor) return;
    if (searchMode === 'replace') {
      setSearchMode(null);
      (editor as any).execCommand('clearSearch');
    } else {
      setSearchMode('replace');
      (editor as any).execCommand('replace');
    }
  };

  return (
    <div className="app-container" data-view-mode={viewMode}>
      <Header
        viewMode={viewMode}
        setSearchMode={setSearchMode}
        searchMode={searchMode}
        onViewModeChange={setViewMode}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((v) => !v)}
        toolbarVisible={toolbarVisible}
        onToggleToolbar={() => setToolbarVisible((prev) => !prev)}
        onToggleFind={toggleFind}
        onToggleReplace={toggleReplace}
      />

      <Toolbar editor={editor} onSave={onSave} hidden={!toolbarVisible} />

      <div className="content-container">
        {/* Editor panel */}
        <div className="editor-panel">
          <div className="panel-header">
            <FaCode /> <span>עריכה</span>
          </div>
          <div className="panel-content">
            <div className="editor-container">
              <textarea ref={editorRef} />
            </div>
          </div>
        </div>

        <div className="divider" />

        {/* Preview panel */}
        <div className="preview-panel">
          <div className="panel-header">
            <FaEye /> <span>תצוגה מקדימה</span>
          </div>
          <div className="panel-content">
            <Preview html={previewHtml} />
          </div>
        </div>
      </div>

      <StatusBar content={content} editor={editor} showCredits={showCredits} />
    </div>
  );
};
