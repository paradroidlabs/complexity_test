import { PplxStreamingTtsPlayer } from "@/plugins/thread-message-tts/utils/pplx-streaming-tts-player";

export class PplxTtsPlayerCoordinator {
  private static instance: PplxTtsPlayerCoordinator;

  private players: PplxStreamingTtsPlayer[] = [];
  private stopFns: (() => void)[] = [];

  private constructor() {}

  public static getInstance(): PplxTtsPlayerCoordinator {
    if (PplxTtsPlayerCoordinator.instance == null) {
      PplxTtsPlayerCoordinator.instance = new PplxTtsPlayerCoordinator();
    }
    return PplxTtsPlayerCoordinator.instance;
  }

  public createPlayer(params: {
    onStart?: () => void;
    onComplete?: () => void;
    stop?: () => void;
  }): PplxStreamingTtsPlayer {
    const player = new PplxStreamingTtsPlayer({
      onStart: () => {
        params.onStart?.();
      },
      onComplete: () => {
        params.onComplete?.();
      },
    });

    this.players.push(player);
    this.stopFns.push(params.stop ?? (() => {}));
    return player;
  }

  public stopAllPlayers(): void {
    this.players.forEach((player, index) => {
      player.stop();
      player.clearBuffer();
      this.stopFns[index]?.();
    });
  }

  public removePlayer(player: PplxStreamingTtsPlayer): void {
    const index = this.players.indexOf(player);
    if (index !== -1) {
      player.stop();
      player.clearBuffer();
      this.players.splice(index, 1);
      this.stopFns.splice(index, 1);
    }
  }
}
