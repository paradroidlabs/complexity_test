import { produce } from "immer";
import { sendMessage } from "webext-bridge/content-script";

import {
  isDeepResearchLanguageModelCode,
  isReasoningLanguageModelCode,
  LanguageModelCode,
} from "@/data/plugins/query-box/language-model-selector/language-models.types";
import { networkInterceptMiddlewareManager } from "@/plugins/_api/network-intercept-middleware-manager/middleware-manager";
import {
  encodePerplexityAskEvent,
  parsePerplexityAskEvent,
} from "@/plugins/_core/network-intercept/utils/parse-perplexity-ask-event";
import { sharedQueryBoxStore } from "@/plugins/_core/ui-groups/query-box/shared-store";

export const handleRewrite = ({
  selectedModel,
  messageBlockIndex,
  isProSearchEnabled,
}: {
  selectedModel: LanguageModelCode;
  messageBlockIndex: number;
  isProSearchEnabled: boolean;
}) => {
  const shouldEnableProSearch =
    (isReasoningLanguageModelCode(selectedModel) || isProSearchEnabled) &&
    selectedModel !== "turbo";

  sharedQueryBoxStore.getState().setIsProSearchEnabled(shouldEnableProSearch);

  setTimeout(() => {
    networkInterceptMiddlewareManager.addMiddleware({
      id: "instant-rewrite-model-change",
      middlewareFn({ data, skip }) {
        const isWSSend =
          data.type === "network-intercept:webSocketEvent" &&
          data.event === "send";
        const isSSESend =
          data.type === "network-intercept:fetchEvent" &&
          data.event === "request";

        if (!isWSSend && !isSSESend) {
          return skip();
        }

        const parsedData = parsePerplexityAskEvent({
          rawData: data.payload.data,
          url: data.payload.url,
        });

        if (parsedData == null) return skip();

        const isRetry = parsedData.params.query_source == "retry";

        if (!isRetry) return skip();

        networkInterceptMiddlewareManager.removeMiddleware(
          "instant-rewrite-model-change",
        );

        const isReasoningModel = isReasoningLanguageModelCode(selectedModel);
        const isDeepResearchModel =
          isDeepResearchLanguageModelCode(selectedModel);

        const newParams = produce(parsedData.params, (draft: any) => {
          draft.mode =
            (isProSearchEnabled || isReasoningModel || isDeepResearchModel) &&
            selectedModel !== "turbo"
              ? "copilot"
              : "concise";
          draft.model_preference = selectedModel;
        });

        const newEncodedPayload = encodePerplexityAskEvent({
          newPayload: {
            ...parsedData,
            params: newParams,
          },
          url: data.payload.url,
        });

        return newEncodedPayload;
      },
    });

    setTimeout(() => {
      networkInterceptMiddlewareManager.removeMiddleware(
        "instant-rewrite-model-change",
      );
    }, 1000);

    sendMessage(
      "reactVdom:triggerRewriteOption",
      {
        messageBlockIndex,
        optionIndex: 1,
      },
      "window",
    );
  }, 300);
};
