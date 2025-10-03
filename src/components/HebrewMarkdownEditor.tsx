import React, { useEffect, useRef, useState, useCallback } from 'react';
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
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

import '../styles/index.css';
import Header, { ViewMode } from './Header';
import Toolbar from './Toolbar';
import Preview from './Preview';
import StatusBar from './StatusBar';
import { FaEye, FaCode } from 'react-icons/fa';

interface HebrewMarkdownEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  onSave?: (content: string) => void;
  height?: string;
  className?: string;
  showCredits?: boolean;
}

export const HebrewMarkdownEditor: React.FC<HebrewMarkdownEditorProps> = ({
  value = '',
  onChange,
  onSave,
  height = '100%',
  className = '',
  showCredits = true,
}) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const editorPanelRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  const [editor, setEditor] = useState<CodeMirror.EditorFromTextArea | null>(null);
  const [content, setContent] = useState<string>(value);
  const [previewHtml, setPreviewHtml] = useState<{ __html: string }>({ __html: '' });
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [toolbarVisible, setToolbarVisible] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [searchMode, setSearchMode] = useState<'find' | 'replace' | null>(null);

  // ----- Editor init -----
  useEffect(() => {
    if (!editorRef.current) return;

    const cm = CodeMirror.fromTextArea(editorRef.current, {
      mode: 'markdown',
      lineWrapping: true,
      direction: 'rtl',
      rtlMoveVisually: true,
      viewportMargin: Infinity,
      extraKeys: {
        Enter: 'newlineAndIndentContinueMarkdownList',
        'Ctrl-F': 'find', 'Cmd-F': 'find',
        'Ctrl-H': 'replace', 'Cmd-H': 'replace',
        'Ctrl-B': () => wrap('**', '**'), 'Cmd-B': () => wrap('**', '**'),
        'Ctrl-I': () => wrap('*', '*'), 'Cmd-I': () => wrap('*', '*'),
        'Ctrl-K': () => wrap('[', '](http://example.com)'), 'Cmd-K': () => wrap('[', '](http://example.com)'),
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
    cm.setValue(value);
  }, []); // Should run only once

  // sync external value
  useEffect(() => {
    if (editor && value !== content) {
      editor.setValue(value);
    }
  }, [value, editor, content]);

  // ----- Marked and Highlight.js setup -----
  useEffect(() => {
    marked.use({
      renderer: {
        code({ text, lang }) {
          if (lang && hljs.getLanguage(lang)) {
            const highlighted = hljs.highlight(text, { language: lang }).value;
            return `<pre><code class="hljs hmr-language-${lang}">${highlighted}</code></pre>`;
          }
          const highlighted = hljs.highlightAuto(text).value;
          return `<pre><code class="hljs">${highlighted}</code></pre>`;
        },
      },
    });
  }, []);

  // ----- Preview render -----
  useEffect(() => {
    const render = async () => {
      let html = await marked.parse(content || '');
      html = html
        .replace(/\$\$([\s\S]*?)\$\$/g, (_, eq) => katex.renderToString(eq, { displayMode: true, throwOnError: false }))
        .replace(/\$([^\$]+)\$/g, (_, eq) => katex.renderToString(eq, { displayMode: false, throwOnError: false }));
      setPreviewHtml({ __html: DOMPurify.sanitize(html) });
    };
    render();
  }, [content]);

  // ----- Resizable divider -----
  const onResizeStart = useCallback((e: React.MouseEvent) => {
    if (viewMode !== 'split' || !editorPanelRef.current || !containerRef.current) return;
    
    const startX = e.clientX;
    const startWidth = editorPanelRef.current.getBoundingClientRect().width;
    
    const onMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const containerWidth = containerRef.current!.clientWidth;
      const newWidth = startWidth + dx; // RTL
      const pct = Math.min(Math.max((newWidth / containerWidth) * 100, 20), 80);
      containerRef.current!.style.setProperty('--editor-width', `${pct}%`);
      containerRef.current!.style.setProperty('--preview-width', `${100 - pct}%`);
      editor?.refresh();
    };

    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      containerRef.current?.classList.remove('hmr-resizing');
      editor?.refresh();
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    containerRef.current.classList.add('hmr-resizing');
  }, [viewMode, editor]);

  // ----- Dark mode -----
  useEffect(() => {
    setTimeout(() => editor?.refresh(), 0);
  }, [darkMode, editor]);

  // ----- Search toggle -----
  const toggleFind = () => {
    if (!editor) return;
    setSearchMode(prev => (prev === 'find' ? null : 'find'));
    (editor as any).execCommand(searchMode !== 'find' ? 'find' : 'clearSearch');
  };
  const toggleReplace = () => {
    if (!editor) return;
    setSearchMode(prev => (prev === 'replace' ? null : 'replace'));
    (editor as any).execCommand(searchMode !== 'replace' ? 'replace' : 'clearSearch');
  };

  const containerClasses = [
    'hmr-container',
    className,
    darkMode ? 'hmr-dark-mode' : '',
  ].filter(Boolean).join(' ');

  return (
    <div ref={containerRef} className={containerClasses} style={{ height }} data-view-mode={viewMode}>
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

      <div className="hmr-content-container">
        <div ref={editorPanelRef} className="hmr-editor-panel">
          <div className="hmr-panel-header">
            <FaCode /> <span>עריכה</span>
          </div>
          <div className="hmr-panel-content">
            <div className="hmr-editor-wrapper">
              <textarea ref={editorRef} defaultValue={value} />
            </div>
          </div>
        </div>

        <div ref={dividerRef} className="hmr-divider" onMouseDown={onResizeStart} />

        <div className="hmr-preview-panel">
          <div className="hmr-panel-header">
            <FaEye /> <span>תצוגה מקדימה</span>
          </div>
          <div className="hmr-panel-content">
            <Preview html={previewHtml} />
          </div>
        </div>
      </div>

      <StatusBar content={content} editor={editor} showCredits={showCredits} />
    </div>
  );
};
