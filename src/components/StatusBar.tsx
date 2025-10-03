import React, { useEffect, useState } from 'react';
import CodeMirror from 'codemirror';

interface StatusBarProps {
  content: string;
  editor: CodeMirror.EditorFromTextArea | null;
  showCredits?: boolean;
}

const StatusBar: React.FC<StatusBarProps> = ({
  content,
  editor,
  showCredits,
}) => {
  const [cursor, setCursor] = useState({ line: 1, ch: 1 });

  useEffect(() => {
    if (!editor) return;
    const handler = (cm: CodeMirror.Editor) => {
      const pos = cm.getCursor();
      setCursor({ line: pos.line + 1, ch: pos.ch + 1 });
    };
    editor.on('cursorActivity', handler);
    return () => editor.off('cursorActivity', handler);
  }, [editor]);

  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const chars = content.length;

  return (
    <footer className="hmr-status-bar">
      <span>
        <i className="fa-solid fa-chart-simple" aria-hidden /> {words} מילים | <span>{chars} תווים</span>
      </span>
      <span>
        שורה {cursor.line}, עמודה {cursor.ch}
      </span>
      {showCredits && (
        <span id="hmr-credit">
          By{' '}
          <a href="https://dorpascal.com" target="_blank" rel="noreferrer">
            Dor Pascal
          </a>
        </span>
      )}
    </footer>
  );
};

export default StatusBar;
