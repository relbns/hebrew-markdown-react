import React from 'react';

interface PreviewProps {
  html: { __html: string };
}

const Preview: React.FC<PreviewProps> = ({ html }) => (
  <div className="preview-content" dir="rtl" dangerouslySetInnerHTML={html} />
);

export default Preview;
