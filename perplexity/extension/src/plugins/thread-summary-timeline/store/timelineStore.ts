import { create } from 'zustand';

interface SummaryNode {
  id: string;
  timestamp: number;
  summary: string;
  messageRange: [number, number];
  keyChanges: string[];
}

interface TimelineState {
  summaryNodes: SummaryNode[];
  isGenerating: boolean;
  setSummaryNodes: (nodes: SummaryNode[]) => void;
  addSummaryNode: (node: SummaryNode) => void;
  setIsGenerating: (isGenerating: boolean) => void;
}

export const useTimelineStore = create<TimelineState>((set) => ({
  summaryNodes: [],
  isGenerating: false,
  setSummaryNodes: (summaryNodes) => set({ summaryNodes }),
  addSummaryNode: (node) => set((state) => ({ summaryNodes: [...state.summaryNodes, node] })),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
}));
