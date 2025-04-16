import { useMutation, useQuery } from "@tanstack/react-query";
import { LuLoaderCircle } from "react-icons/lu";
import type { RouteObject } from "react-router-dom";
import { redirect, useNavigate } from "react-router-dom";
import { sendMessage } from "webext-bridge/content-script";

import AsyncButton from "@/components/AsyncButton";
import CopyButton from "@/components/CopyButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import CsUiPluginsGuard from "@/plugins/_core/plugins-guard/CsUiPluginsGuard";
import { cplxApiQueries } from "@/services/cplx-api/query-keys";
import { PluginsStatesService } from "@/services/plugins-states";
import { PplxApiService } from "@/services/pplx-api";
import { unixTimestampToDate } from "@/utils/dayjs";
import { fetchResource, setCookie } from "@/utils/utils";

function CanvasPrePromptInstallationDialog() {
  const navigate = useNavigate();

  const {
    data: canvasInstruction,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["canvas", "instructions"],
    queryFn: () => {
      return fetchResource(
        `https://cdn.cplx.app/prompts/canvas-instruction-claude.md?t=${Date.now()}`,
      );
    },
  });

  const { mutateAsync: createSpace } = useMutation({
    mutationKey: ["createSpace"],
    mutationFn: PplxApiService.createSpace,
    onSuccess: (data) => {
      toast({
        title: `✅ "CPLX Canvas" Space installed`,
        description: "The Canvas Pre-Prompt has been installed as a Space.",
      });

      setCookie(
        `pplx.source-selection-v3-space-${data.uuid}`,
        JSON.stringify([]),
        365,
      );

      sendMessage(
        "spa-router:push",
        {
          url: `/collections/${data.slug}`,
        },
        "window",
      );
    },
    onError: () => {
      toast({
        title: `❌ Failed to install "CPLX Canvas" Space`,
      });
    },
    onSettled: () => {
      navigate("/");
    },
  });

  const { data: versions } = useQuery(cplxApiQueries.versions);

  return (
    <Dialog
      defaultOpen={true}
      closeOnInteractOutside={false}
      closeOnEscape={false}
      onExitComplete={() => {
        navigate("/");
      }}
    >
      <DialogContent className="x:max-w-max">
        <DialogHeader>
          <DialogTitle>Install Canvas Pre-Prompt as Space</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          You are about to install the Canvas Pre-Prompt as a Perplexity&apos;s
          Space. This will enable advanced features for the Canvas plugin.
        </DialogDescription>
        <div className="x:flex x:w-full x:flex-col x:gap-2">
          <div className="x:text-sm x:text-muted-foreground">
            For reference, here is the prompt:
          </div>
          <ScrollArea className="x:h-[500px] x:w-full x:rounded-md x:border x:border-border/50 x:bg-secondary x:text-sm x:text-secondary-foreground">
            {isFetching && !canvasInstruction && (
              <div className="x:flex x:flex-col x:gap-2">
                <p className="x:p-4 x:text-sm x:text-muted-foreground">
                  Fetching the Canvas Pre-Prompt, please wait...
                </p>
              </div>
            )}
            {isError && (
              <div className="x:flex x:flex-col x:gap-2">
                <p className="x:p-4 x:text-sm x:text-muted-foreground">
                  Failed to fetch the Canvas Pre-Prompt.
                </p>
              </div>
            )}
            {canvasInstruction && (
              <>
                <CopyButton
                  className="x:float-right x:mt-4 x:mr-4"
                  content={canvasInstruction}
                />
                <div className="x:max-w-full x:p-4 x:break-words x:whitespace-pre-line">
                  {canvasInstruction}
                </div>
              </>
            )}
          </ScrollArea>
        </div>
        {versions?.canvasInstructionLastUpdated != null && (
          <div className="x:text-sm x:text-muted-foreground">
            Last updated:{" "}
            {unixTimestampToDate({
              unixTimestamp: versions.canvasInstructionLastUpdated,
            })}
          </div>
        )}
        <DialogFooter>
          <DialogClose asChild tabIndex={-1}>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <AsyncButton
            disabled={isFetching || !canvasInstruction}
            loadingText={
              <div className="x:flex x:items-center x:gap-2">
                <LuLoaderCircle className="x:animate-spin" />
                <span>Installing...</span>
              </div>
            }
            onClick={async () => {
              if (!canvasInstruction) {
                return;
              }

              await createSpace({
                title: "CPLX Canvas",
                description: "",
                emoji: "1f5bc-fe0f",
                instructions: canvasInstruction,
                model_selection: "claude2",
              });
            }}
          >
            Install
          </AsyncButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const canvasPrePromptInstallationDialogRouterRoute: RouteObject = {
  path: "/cplx/canvas/install-pre-prompt-as-space",
  loader: () => {
    const pluginsStates = PluginsStatesService.getEnableStatesCachedSync();

    if (!pluginsStates["thread:canvas"]) {
      return redirect("/");
    }

    return null;
  },
  element: (
    <CsUiPluginsGuard desktopOnly dependentPluginIds={["thread:canvas"]}>
      <CanvasPrePromptInstallationDialog />
    </CsUiPluginsGuard>
  ),
};
