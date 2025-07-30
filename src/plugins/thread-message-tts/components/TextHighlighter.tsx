import React from 'react';
import { TextBoundary } from '../utils/textBoundaryParser';

interface TextHighlighterProps {
  text: string;
  boundaries: TextBoundary[];
  activeWordIndex: number;
  highlightStyle?: 'underline' | 'background' | 'bold';
}

export const TextHighlighter: React.FC<TextHighlighterProps> = ({
  text, boundaries, activeWordIndex, highlightStyle = 'background'
}) => {
  if (!boundaries.length) {
    return <span>{text}</span>;
  }

  const words = text.split(/\s+/);

  return (
    <span>
      {words.map((word, index) => (
        <span
          key={index}
          className={`tts-word ${index === activeWordIndex ? `tts-word--active-${highlightStyle}` : ''}`}
          style={{
            backgroundColor: index === activeWordIndex && highlightStyle === 'background' ? '#ffeb3b' : 'transparent',
            textDecoration: index === activeWordIndex && highlightStyle === 'underline' ? 'underline' : 'none',
            fontWeight: index === activeWordIndex && highlightStyle === 'bold' ? 'bold' : 'normal'
          }}
        >
          {word}{' '}
        </span>
      ))}
    </span>
  );
};
