import { onMessage } from "webext-bridge/window";

import { getCodeBlockContent } from "@/plugins/_core/react-vdom/actions/get-code-block-content";
import {
  getMessages,
  MessageBlockFiberData,
} from "@/plugins/_core/react-vdom/actions/get-messages";
import { triggerRewriteOption } from "@/plugins/_core/react-vdom/actions/trigger-rewrite-option";

export type ReactVdomEvents = {
  "reactVdom:getMessages": () => MessageBlockFiberData[] | null;
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
};

export function setupReactVdomListeners() {
  onMessage("reactVdom:getMessages", () => getMessages());

  onMessage("reactVdom:getCodeBlockContent", ({ data }) =>
    getCodeBlockContent(data),
  );

  onMessage("reactVdom:triggerRewriteOption", ({ data }) =>
    triggerRewriteOption(data),
  );
}
