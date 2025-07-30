import React from 'react';
import { useThreadTimeline } from '../hooks/useThreadTimeline';
import { SummaryNode } from './SummaryNode';
import { TimelineControls } from './TimelineControls';

interface TimelineViewProps {
  threadId: string;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ threadId }) => {
  const { summaryNodes, isGenerating } = useThreadTimeline(threadId);

  const handleZoomIn = () => {
    // Implement zoom in logic
  };

  const handleZoomOut = () => {
    // Implement zoom out logic
  };

  const handleGoToPresent = () => {
    // Implement go to present logic
  };

  return (
    <div className="timeline-view">
      <TimelineControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onGoToPresent={handleGoToPresent}
      />
      <div className="timeline-nodes">
        {summaryNodes.map((node) => (
          <SummaryNode key={node.id} node={node} />
        ))}
      </div>
      {isGenerating && <div className="loading-indicator">Generating...</div>}
    </div>
  );
};
