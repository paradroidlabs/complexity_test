import { Howl } from "howler";

const AUDIO_CONFIG = {
  sampleRate: 44100,
  bytesPerSample: 2,
  pcmFormat: 1,
  wavHeaderSize: 44,
  channels: 1,
  bitsPerSample: 16,
} as const;

const WAV_HEADER = {
  riffChunkId: 0x52494646,
  waveFormat: 0x57415645,
  fmtChunkId: 0x666d7420,
  dataChunkId: 0x64617461,
} as const;

type PlaybackState = {
  isPlaying: boolean;
  isPending: boolean;
};

export class PplxStreamingTtsPlayer {
  private audioChunks: Int16Array[] = [];
  private activeSound: Howl | null = null;

  private playbackState: PlaybackState = {
    isPlaying: false,
    isPending: false,
  };

  private speed: number = 1;
  private isSessionActive: boolean = false;

  private onStart: (() => void) | null = null;
  private onComplete: (() => void) | null = null;

  constructor({
    onStart,
    onComplete,
    speed,
  }: {
    onStart?: () => void;
    onComplete?: () => void;
    speed?: number;
  }) {
    this.onStart = onStart ?? null;
    this.onComplete = onComplete ?? null;
    this.speed = speed ?? 1;
  }

  public startSession() {
    this.clearBuffer();
    this.isSessionActive = true;
    this.resetPlaybackState();
  }

  private resetPlaybackState() {
    this.playbackState = {
      isPlaying: false,
      isPending: false,
    };
  }

  private createWavHeader(dataLength: number): ArrayBuffer {
    const headerBuffer = new ArrayBuffer(AUDIO_CONFIG.wavHeaderSize);
    const view = new DataView(headerBuffer);

    view.setUint32(0, WAV_HEADER.riffChunkId, false);
    view.setUint32(4, 36 + dataLength, true);
    view.setUint32(8, WAV_HEADER.waveFormat, false);

    view.setUint32(12, WAV_HEADER.fmtChunkId, false);
    view.setUint32(16, 16, true);
    view.setUint16(20, AUDIO_CONFIG.pcmFormat, true);
    view.setUint16(22, AUDIO_CONFIG.channels, true);
    view.setUint32(24, AUDIO_CONFIG.sampleRate, true);
    view.setUint32(
      28,
      AUDIO_CONFIG.sampleRate * AUDIO_CONFIG.bytesPerSample,
      true,
    );
    view.setUint16(32, AUDIO_CONFIG.bytesPerSample, true);
    view.setUint16(34, AUDIO_CONFIG.bitsPerSample, true);

    view.setUint32(36, WAV_HEADER.dataChunkId, false);
    view.setUint32(40, dataLength, true);

    return headerBuffer;
  }

  private createWavBlob(audioData: Int16Array): Blob {
    const dataLength = audioData.length * AUDIO_CONFIG.bytesPerSample;
    const wavBuffer = new ArrayBuffer(AUDIO_CONFIG.wavHeaderSize + dataLength);

    new Uint8Array(wavBuffer).set(
      new Uint8Array(this.createWavHeader(dataLength)),
    );
    new Int16Array(wavBuffer, AUDIO_CONFIG.wavHeaderSize).set(audioData);

    return new Blob([wavBuffer], { type: "audio/wav" });
  }

  private handleSoundEnd = (url: string) => {
    if (!this.isSessionActive) return;

    URL.revokeObjectURL(url);
    this.audioChunks.shift();
    this.activeSound?.unload();
    this.activeSound = null;

    this.playbackState.isPlaying = false;
    this.playbackState.isPending = false;

    if (this.isSessionActive) {
      this.playNextChunk();
    }
  };

  public addChunk(chunk: Int16Array, autoPlay = true) {
    if (!this.isSessionActive) return;

    if (this.onStart && this.audioChunks.length === 0) {
      this.onStart();
    }

    this.audioChunks.push(chunk);
    if (autoPlay) this.playNextChunk();
  }

  public async playNextChunk(): Promise<void> {
    if (!this.isSessionActive) return;

    if (this.playbackState.isPlaying || this.playbackState.isPending) {
      return;
    }

    if (!this.audioChunks.length) {
      if (this.onComplete) {
        this.onComplete();
      }
      return;
    }

    const chunk = this.audioChunks[0];
    if (!chunk) return;

    this.playbackState.isPending = true;

    try {
      const blob = this.createWavBlob(chunk);
      const objectUrl = URL.createObjectURL(blob);

      this.activeSound = new Howl({
        src: [objectUrl],
        format: ["wav"],
        autoplay: true,
        rate: this.speed,
        onend: () => this.handleSoundEnd(objectUrl),
        onloaderror: () => {
          URL.revokeObjectURL(objectUrl);
          this.audioChunks.shift();
          this.playbackState.isPending = false;
          this.playNextChunk();
        },
      });

      this.playbackState.isPlaying = true;
    } catch (error) {
      console.error("Audio playback failed:", error);
      this.audioChunks.shift();
      this.playbackState.isPending = false;
      this.playNextChunk();
    }
  }

  public stop() {
    this.isSessionActive = false;

    if (this.activeSound) {
      this.activeSound.stop();
      this.activeSound.unload();
      this.activeSound = null;
    }

    this.resetPlaybackState();
    this.clearBuffer();
  }

  public clearBuffer() {
    this.audioChunks = [];
  }

  public setSpeed(speed: number) {
    this.speed = speed;
    if (this.activeSound) {
      this.activeSound.rate(speed);
    }
  }
}
