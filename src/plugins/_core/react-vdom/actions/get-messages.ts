import { LanguageModelCode } from "@/data/plugins/query-box/language-model-selector/language-models.types";
import { findReactFiberNodeValue } from "@/plugins/_core/react-vdom/utils";
import { errorWrapper } from "@/utils/error-wrapper";
import { PplxWebResult } from "@/utils/thread-export";
import { UiUtils } from "@/utils/ui-utils";
import { getReactFiberKey } from "@/utils/utils";

export type MessageBlockFiberData = {
  backendUuid: string;
  title: string;
  answer: string;
  webResults: PplxWebResult[];
  displayModel: LanguageModelCode;
  isInFlight: boolean;
  authorUuid: string | null;
};

export function getMessages(): MessageBlockFiberData[] | null {
  const $messagesContainer = UiUtils.getMessagesContainer();

  if (!$messagesContainer[0]) return null;

  const fiberNode = ($messagesContainer[0] as any)[
    getReactFiberKey($messagesContainer[0])
  ];

  if (fiberNode == null) return null;

  const [messages, error] = errorWrapper(() => {
    return findReactFiberNodeValue({
      fiberNode,
      condition: (node) => {
        return (
          node.return.memoizedState.next.next.memoizedState.current.results !=
          null
        );
      },
      select: (node): MessageBlockFiberData[] => {
        return (
          node.return.memoizedState.next.next.memoizedState.current
            .results as any[]
        ).map((entry) => ({
          title: entry.query_str,
          backendUuid: entry.backend_uuid,
          answer: (entry.blocks as any[])
            .filter((block) => block.intended_usage === "ask_text")
            .map((chunk: any) => chunk.markdown_block.chunks.join(""))
            .join(""),
          webResults: (entry.blocks as any[])
            .filter((block) => block.intended_usage === "web_results")
            .map((chunk: any) =>
              chunk.web_result_block.web_results.map((result: any) => ({
                name: result.name,
                url: result.url,
                snippet: result.snippet,
              })),
            )
            .flat(),

          displayModel: entry.display_model,
          isInFlight: entry.status !== "COMPLETED",
          authorUuid: entry.author_id ?? null,
        }));
      },
    });
  })();

  if (error) {
    console.warn(
      "[VDOM Plugin] getMessages",
      "Ref:",
      $messagesContainer,
      "Error:",
      error,
    );

    return null;
  }

  return messages;
}
