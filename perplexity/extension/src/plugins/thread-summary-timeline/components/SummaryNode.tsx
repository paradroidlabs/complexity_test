import React from 'react';

interface SummaryNodeProps {
  node: {
    id: string;
    timestamp: number;
    summary: string;
    messageRange: [number, number];
    keyChanges: string[];
  };
}

export const SummaryNode: React.FC<SummaryNodeProps> = ({ node }) => {
  return (
    <div className="summary-node">
      <div className="summary-node-timestamp">
        {new Date(node.timestamp).toLocaleTimeString()}
      </div>
      <div className="summary-node-content">
        <div className="summary-node-summary">{node.summary}</div>
        <div className="summary-node-key-changes">
          {node.keyChanges.map((change, index) => (
            <span key={index} className="key-change-badge">
              {change}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
