import React from 'react';

interface TimelineControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onGoToPresent: () => void;
}

export const TimelineControls: React.FC<TimelineControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onGoToPresent,
}) => {
  return (
    <div className="timeline-controls">
      <button onClick={onZoomIn}>Zoom In</button>
      <button onClick={onZoomOut}>Zoom Out</button>
      <button onClick={onGoToPresent}>Go to Present</button>
    </div>
  );
};
