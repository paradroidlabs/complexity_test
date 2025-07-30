import React, { useState, useEffect } from 'react';
import TtsAudioPlayer from './TtsAudioPlayer';
import { exportWavFromAudioBuffer } from './utils/wavExport';
import { fetchTtsAudio } from './utils/fetchTtsAudio';
import { TextHighlighter } from './components/TextHighlighter';
import { useTtsHighlightSync } from './hooks/useTtsHighlightSync';
import { parseTextBoundaries, TextBoundary } from './utils/textBoundaryParser';

function ThreadMessageTtsButton({ ttsText }) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [textBoundaries, setTextBoundaries] = useState<TextBoundary[]>([]);
  const [highlightStyle, setHighlightStyle] = useState<'underline' | 'background' | 'bold'>('background');
  const { activeWordIndex } = useTtsHighlightSync(textBoundaries, isPlaying, currentTime);

  useEffect(() => {
    async function synthesize() {
      const utterance = new SpeechSynthesisUtterance(ttsText);
      const audioBlob = await fetchTtsAudio(ttsText);
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);

      const boundaries = await parseTextBoundaries(ttsText, utterance);
      setTextBoundaries(boundaries);
    }
    if (ttsText) synthesize();
  }, [ttsText]);

  const handleExport = async () => {
    if (!audioUrl) return;
    const audioBlob = await fetch(audioUrl).then(r => r.blob());
    exportWavFromAudioBuffer(audioBlob, ttsText.slice(0, 30));
  };

  return (
    <div className="thread-message-tts-enhanced">
      <TextHighlighter
        text={ttsText}
        boundaries={textBoundaries}
        activeWordIndex={activeWordIndex}
        highlightStyle={highlightStyle}
      />
      <div className="thread-message-tts-controls">
        <TtsAudioPlayer
          audioUrl={audioUrl}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          currentTime={currentTime}
          setCurrentTime={setCurrentTime}
          duration={duration}
          setDuration={setDuration}
        />
        <button onClick={handleExport} disabled={!audioUrl}>Export WAV</button>
      </div>
    </div>
  );
}

export default ThreadMessageTtsButton;
