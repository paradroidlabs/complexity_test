// Import new player and the export function
import TtsAudioPlayer from './TtsAudioPlayer';
import { exportWavFromAudioBuffer } from './utils/wavExport';
import { fetchTtsAudio } from './utils/fetchTtsAudio';
import React, { useState, useEffect } from 'react';

function ThreadMessageTtsButton({ ttsText }) {
  // New local state for audio/UI
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Prepare audio when ttsText changes
  useEffect(() => {
    // Example: Synthesize audio using Web Speech or TTS service, get AudioBuffer
    async function synthesize() {
      // You’ll need your TTS fetch-to-blob logic here
      const audioBlob = await fetchTtsAudio(ttsText); // returns a Blob
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
    }
    if (ttsText) synthesize();
  }, [ttsText]);

  // Export handler
  const handleExport = async () => {
    if (!audioUrl) return;
    const audioBlob = await fetch(audioUrl).then(r => r.blob());
    exportWavFromAudioBuffer(audioBlob, ttsText.slice(0, 30));
  };

  return (
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
  );
}
export default ThreadMessageTtsButton;
