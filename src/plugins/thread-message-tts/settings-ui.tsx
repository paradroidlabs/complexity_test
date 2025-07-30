import React from 'react';

interface SettingsUIProps {
  highlightStyle: 'underline' | 'background' | 'bold';
  setHighlightStyle: (style: 'underline' | 'background' | 'bold') => void;
}

export const SettingsUI: React.FC<SettingsUIProps> = ({ highlightStyle, setHighlightStyle }) => {
  return (
    <div className="tts-settings">
      <h3>Highlight Style</h3>
      <select
        value={highlightStyle}
        onChange={(e) => setHighlightStyle(e.target.value as 'underline' | 'background' | 'bold')}
      >
        <option value="background">Background</option>
        <option value="underline">Underline</option>
        <option value="bold">Bold</option>
      </select>
    </div>
  );
};
