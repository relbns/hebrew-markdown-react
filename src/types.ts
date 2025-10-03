export const VIEW_MODES = {
  SPLIT: 'split',
  EDITOR_ONLY: 'editor-only',
  PREVIEW_ONLY: 'preview-only',
} as const;

export type ViewMode = typeof VIEW_MODES[keyof typeof VIEW_MODES];
