import { FaStopCircle } from "react-icons/fa";
import { HiOutlineSpeakerWave } from "react-icons/hi2";
import { LuLoaderCircle } from "react-icons/lu";
import { sendMessage } from "webext-bridge/content-script";

import Tooltip from "@/components/Tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TTS_VOICES, TtsVoice } from "@/data/plugins/thread-message-tts/types";
import usePplxTtsRequest from "@/plugins/thread-message-tts/hooks/usePplxTtsRequest";
import { PplxTtsPlayerCoordinator } from "@/plugins/thread-message-tts/utils/coordinator";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage";

export default function ThreadMessageTtsButton({
  messageBlockIndex,
}: {
  messageBlockIndex: number;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [firstChunkArrived, setFirstChunkArrived] = useState(false);

  const {
    mutation: { mutateAsync: playTts, isPending },
    abort,
  } = usePplxTtsRequest();

  const pendingRef = useRef(isPending);

  useEffect(() => {
    pendingRef.current = isPending;
  }, [isPending]);

  const [player] = useState(() =>
    PplxTtsPlayerCoordinator.getInstance().createPlayer({
      onStart: () => {
        setFirstChunkArrived(true);
      },
      onComplete: () => {
        if (pendingRef.current) return;
        setPlaying(false);
        setFirstChunkArrived(false);
        abort();
      },
      stop: () => {
        setPlaying(false);
        setFirstChunkArrived(false);
        abort();
      },
    }),
  );

  const stopTts = useCallback(() => {
    PplxTtsPlayerCoordinator.getInstance().stopAllPlayers();
    setPlaying(false);
    setFirstChunkArrived(false);
  }, []);

  const initTts = useCallback(
    async (params?: { voice: TtsVoice }) => {
      if (playing) {
        stopTts();
        return;
      }

      stopTts();
      player.startSession();
      setPlaying(true);

      const backendUuid = await sendMessage(
        "reactVdom:getMessageBackendUuid",
        { index: messageBlockIndex },
        "window",
      );

      if (!backendUuid) {
        setPlaying(false);
        return;
      }

      const extensionSettings = await ExtensionLocalStorageService.get();
      const selectedVoice =
        params?.voice || extensionSettings.plugins["thread:messageTts"].voice;

      playTts({
        backendUuid,
        voice: selectedVoice,
        onBufferUpdate: (chunk: Int16Array) => player.addChunk(chunk),
        onError: () => {
          setPlaying(false);
        },
      });
    },
    [playing, player, messageBlockIndex, stopTts, playTts],
  );

  useEffect(() => {
    return () => {
      stopTts();
      player.clearBuffer();
      PplxTtsPlayerCoordinator.getInstance().removePlayer(player);
    };
  }, [player, stopTts]);

  if (playing && !firstChunkArrived) {
    return (
      <div className="x-rounded-md x-p-2 x-text-muted-foreground">
        <LuLoaderCircle className="x-size-4 x-animate-spin" />
      </div>
    );
  }

  return (
    <DropdownMenu
      lazyMount
      unmountOnExit
      open={menuOpen}
      onOpenChange={({ open }) => setMenuOpen(open)}
      onSelect={({ value }) => {
        initTts({ voice: value as TtsVoice });
        ExtensionLocalStorageService.set((draft) => {
          draft.plugins["thread:messageTts"].voice = value as TtsVoice;
        });
      }}
    >
      <Tooltip content={playing ? t("misc.stop") : t("misc.speakAloud")}>
        <DropdownMenuTrigger asChild>
          <div
            className="x-cursor-pointer x-rounded-md x-p-2 x-text-muted-foreground x-transition-all hover:x-bg-muted/50 hover:x-text-foreground active:x-scale-95"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (menuOpen) {
                return;
              }
              initTts();
            }}
            onContextMenu={(e) => {
              if (playing) {
                return;
              }

              e.preventDefault();
              setMenuOpen(true);
            }}
          >
            {playing ? (
              <FaStopCircle className="x-size-4 x-text-primary" />
            ) : (
              <HiOutlineSpeakerWave className="x-size-4" />
            )}
          </div>
        </DropdownMenuTrigger>
      </Tooltip>
      <DropdownMenuContent>
        {TTS_VOICES.map((voice) => (
          <DropdownMenuItem key={voice} value={voice}>
            {voice}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
