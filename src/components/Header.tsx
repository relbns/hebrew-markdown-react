import React from 'react';
import classNames from 'classnames';
import {
  FaCode,
  FaEye,
  FaColumns,
  FaSearch,
  FaExchangeAlt,
  FaPalette,
  FaChevronDown,
} from 'react-icons/fa';
import logoUrl from '../assets/logo.svg';
import { ViewMode } from '../types';

interface HeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  toolbarVisible: boolean;
  onToggleToolbar: () => void;
  searchMode: 'find' | 'replace' | null;
  setSearchMode: (mode: 'find' | 'replace' | null) => void;
  onToggleFind: () => void;
  onToggleReplace: () => void;
}

const Header: React.FC<HeaderProps> = ({
  viewMode,
  onViewModeChange,
  darkMode,
  onToggleDarkMode,
  toolbarVisible,
  onToggleToolbar,
  onToggleFind,
  onToggleReplace,
  searchMode,
  setSearchMode,
}) => {
  return (
    <header className="hmr-header">
      <div className="hmr-title">
        <img className="hmr-logo" src={logoUrl} alt="logo" />
        <h1>Hebrew Markdown</h1>
      </div>

      <div className="hmr-header-controls">
        {viewMode !== 'preview-only' && (
          <div className="hmr-control-group">
            <button
              className={classNames('hmr-btn', { 'hmr-active': searchMode === 'find' })}
              onClick={onToggleFind}
              title="חיפוש (Ctrl/Cmd+F)"
            >
              <FaSearch />
              <span className="hmr-tooltip">חיפוש (Ctrl/Cmd+F)</span>
            </button>
            <button
              className={classNames('hmr-btn', {
                'hmr-active': searchMode === 'replace',
              })}
              onClick={onToggleReplace}
              title="החלפה (Ctrl/Cmd+H)"
            >
              <FaExchangeAlt />
              <span className="hmr-tooltip">החלפה (Ctrl/Cmd+H)</span>
            </button>
          </div>
        )}

        <div className="hmr-view-modes">
          <button
            className={classNames('hmr-view-mode-btn', {
              active: viewMode === 'editor-only',
            })}
            onClick={() => {
              onViewModeChange('editor-only');
              setSearchMode(null);
            }}
            title="עריכה"
          >
            <FaCode /> עריכה
          </button>
          <button
            className={classNames('hmr-view-mode-btn', {
              active: viewMode === 'split',
            })}
            onClick={() => {
              onViewModeChange('split');
              setSearchMode(null);
            }}
            title="מפוצל"
          >
            <FaColumns /> מפוצל
          </button>
          <button
            className={classNames('hmr-view-mode-btn', {
              active: viewMode === 'preview-only',
            })}
            onClick={() => {
              onViewModeChange('preview-only');
              setSearchMode(null);
            }}
            title="תצוגה"
          >
            <FaEye /> תצוגה
          </button>
        </div>

        <div className="hmr-control-group">
          <button
            className={classNames('hmr-btn', { 'hmr-active': darkMode })}
            onClick={onToggleDarkMode}
            title="מצב כהה/בהיר"
          >
            <FaPalette />
            <span className="hmr-tooltip">מצב כהה/בהיר</span>
          </button>

          <div className="hmr-tool-divider" />

          <button
            className={classNames('hmr-btn', {
              'hmr-active': !toolbarVisible,
            })}
            onClick={onToggleToolbar}
            aria-pressed={!toolbarVisible}
            title={toolbarVisible ? 'הסתר סרגל כלים' : 'הצג סרגל כלים'}
          >
            <FaChevronDown />
            <span className="hmr-tooltip">
              {toolbarVisible ? 'הסתר סרגל כלים' : 'הצג סרגל כלים'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
