import { onMessage, sendMessage } from "webext-bridge/window";

import { DomSelectorsRegistry } from "@/data/dom-selectors-registry";
import { getCodeBlockContent } from "@/plugins/_core/main-world/react-vdom/actions/get-code-block-content";
import type { MessageBlockFiberData } from "@/plugins/_core/main-world/react-vdom/actions/get-messages";
import { getMessages } from "@/plugins/_core/main-world/react-vdom/actions/get-messages";
import { triggerRewriteOption } from "@/plugins/_core/main-world/react-vdom/actions/trigger-rewrite-option";

declare module "@/types/webext-bridge-overrides" {
  interface EventHandlers {
    "reactVdom:getMessages": (params: {
      remoteFiberNodePath?: string[];
    }) => MessageBlockFiberData[] | null;
    "reactVdom:getCodeBlockContent": (params: {
      messageBlockIndex: number;
      codeBlockIndex: number;
    }) => {
      code: string;
      language: string;
    } | null;
    "reactVdom:triggerRewriteOption": (params: {
      messageBlockIndex: number;
      optionIndex?: number;
    }) => boolean;
  }
}

export async function setupReactVdomListeners() {
  DomSelectorsRegistry.remote = await sendMessage(
    "cache:domSelectors",
    undefined,
    "content-script",
  );

  onMessage("reactVdom:getMessages", ({ data }) => getMessages(data));

  onMessage("reactVdom:getCodeBlockContent", ({ data }) =>
    getCodeBlockContent(data),
  );

  onMessage("reactVdom:triggerRewriteOption", ({ data }) =>
    triggerRewriteOption(data),
  );
}
