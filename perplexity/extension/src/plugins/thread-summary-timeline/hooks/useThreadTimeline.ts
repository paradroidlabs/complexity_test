import { useState, useEffect } from 'react';
import { generateSummary } from '../utils/summaryGenerator';
import { useTimelineStore } from '../store/timelineStore';

// Define the ThreadMessage interface according to the structure of the messages in the thread
interface ThreadMessage {
  content: string;
  timestamp: number;
  type: 'user' | 'ai';
  artifacts?: any[];
}


export function useThreadTimeline(threadId: string) {
  const { summaryNodes, addSummaryNode, isGenerating, setIsGenerating } = useTimelineStore();

  // Function to extract messages from the DOM
  const extractThreadMessages = (): ThreadMessage[] => {
    const messages: ThreadMessage[] = [];
    // This is a placeholder selector. Replace with the actual selector for messages.
    const messageElements = document.querySelectorAll('[data-message-id]');

    messageElements.forEach(el => {
      const content = el.textContent || '';
      const timestamp = parseInt(el.getAttribute('data-timestamp') || '0', 10);
      const type = el.getAttribute('data-message-type') as 'user' | 'ai';

      messages.push({ content, timestamp, type });
    });

    return messages;
  };

  useEffect(() => {
    const observer = new MutationObserver(() => {
      generateTimelineIfNeeded();
    });

    const threadContainer = document.querySelector(`[data-thread-id="${threadId}"]`);
    if (threadContainer) {
      observer.observe(threadContainer, { childList: true, subtree: true });
    }

    return () => observer.disconnect();
  }, [threadId]);

  const generateTimelineIfNeeded = async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    const messages = extractThreadMessages();

    if (messages.length > summaryNodes.length * 5) {
      const newSummary = await generateSummary(
        messages,
        summaryNodes.length * 5,
        messages.length
      );
      addSummaryNode(newSummary);
    }

    setIsGenerating(false);
  };

  return { summaryNodes, isGenerating };
}
