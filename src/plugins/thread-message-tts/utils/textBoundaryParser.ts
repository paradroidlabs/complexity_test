// /src/plugins/thread-message-tts/utils/textBoundaryParser.ts
export interface TextBoundary {
  word: string;
  startTime: number;
  endTime: number;
  charStart: number;
  charEnd: number;
}

export function parseTextBoundaries(text: string, utterance: SpeechSynthesisUtterance): Promise<TextBoundary[]> {
  return new Promise((resolve) => {
    const boundaries: TextBoundary[] = [];
    let wordIndex = 0;
    const words = text.split(/\s+/);

    utterance.onboundary = (event) => {
      if (event.name === 'word' && wordIndex < words.length) {
        boundaries.push({
          word: words[wordIndex],
          startTime: event.elapsedTime,
          endTime: event.elapsedTime + 500, // Estimate based on word length
          charStart: event.charIndex,
          charEnd: event.charIndex + words[wordIndex].length
        });
        wordIndex++;
      }
    };

    utterance.onend = () => resolve(boundaries);
  });
}
