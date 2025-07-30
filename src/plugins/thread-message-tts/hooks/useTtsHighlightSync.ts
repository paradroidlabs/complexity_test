import { useState, useEffect } from 'react';
import { TextBoundary } from '../utils/textBoundaryParser';

export function useTtsHighlightSync(boundaries: TextBoundary[], isPlaying: boolean, currentTime: number) {
  const [activeWordIndex, setActiveWordIndex] = useState<number>(-1);

  useEffect(() => {
    if (!isPlaying || !boundaries.length) {
      setActiveWordIndex(-1);
      return;
    }

    const activeIndex = boundaries.findIndex(
      boundary => currentTime >= boundary.startTime && currentTime <= boundary.endTime
    );

    setActiveWordIndex(activeIndex);
  }, [boundaries, isPlaying, currentTime]);

  return { activeWordIndex };
}
