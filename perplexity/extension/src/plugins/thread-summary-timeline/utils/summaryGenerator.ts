// /src/plugins/thread-summary-timeline/utils/summaryGenerator.ts
interface ThreadMessage {
  content: string;
  timestamp: number;
  type: 'user' | 'ai';
  artifacts?: any[];
}

interface SummaryNode {
  id: string;
  timestamp: number;
  summary: string;
  messageRange: [number, number];
  keyChanges: string[];
}

export async function generateSummary(messages: ThreadMessage[], fromIndex: number, toIndex: number): Promise<SummaryNode> {
  const relevantMessages = messages.slice(fromIndex, toIndex);
  const content = relevantMessages.map(m => m.content).join('\n');

  // Simple keyword extraction for key changes
  const keyChanges = extractKeyChanges(relevantMessages);

  return {
    id: `summary-${Date.now()}`,
    timestamp: relevantMessages[relevantMessages.length - 1]?.timestamp || Date.now(),
    summary: await summarizeContent(content),
    messageRange: [fromIndex, toIndex],
    keyChanges
  };
}

async function summarizeContent(content: string): Promise<string> {
  // Integration with AI or simple extractive summarization
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  return sentences.slice(0, 2).join('. ') + (sentences.length > 2 ? '...' : '');
}

function extractKeyChanges(messages: ThreadMessage[]): string[] {
  const changes = [];
  messages.forEach(msg => {
    if (msg.artifacts?.length) changes.push('Generated artifacts');
    if (msg.content.includes('code')) changes.push('Code discussion');
    if (msg.content.length > 500) changes.push('Detailed response');
  });
  return changes;
}
