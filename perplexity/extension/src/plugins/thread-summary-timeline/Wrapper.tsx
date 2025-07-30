import React from 'react';
import { TimelineView } from './components/TimelineView';
import { useThreadDomObserverStore } from '@/plugins/_core/dom-observers/thread/store';

export function Wrapper() {
  const threadId = useThreadDomObserverStore(
    (store) => store.threadId,
  );

  if (!threadId) {
    return null;
  }

  return <TimelineView threadId={threadId} />;
}
