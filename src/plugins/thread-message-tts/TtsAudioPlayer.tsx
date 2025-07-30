import React, { useRef, useEffect } from 'react';

const TtsAudioPlayer = ({
  audioUrl, isPlaying, setIsPlaying, currentTime, setCurrentTime, duration, setDuration
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, audioUrl]);

  const onTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const onSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  return (
    <div>
      <audio
        src={audioUrl || undefined}
        ref={audioRef}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        hidden
      />
      <button onClick={() => setIsPlaying(!isPlaying)} disabled={!audioUrl}>
        {isPlaying ? "Pause" : "Play"}
      </button>
      <input
        type="range"
        min={0}
        max={duration}
        step={0.01}
        value={currentTime}
        onChange={onSeek}
        disabled={!audioUrl}
      />
      <span>
        {Math.floor(currentTime)}/{Math.floor(duration)}s
      </span>
    </div>
  );
};

export default TtsAudioPlayer;
