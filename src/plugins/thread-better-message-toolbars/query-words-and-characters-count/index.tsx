import { useThreadMessageBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/message-blocks/store";

export default function QueryWordsAndCharactersCount({
  messageBlockIndex,
}: {
  messageBlockIndex: number;
}) {
  const title = useThreadMessageBlocksDomObserverStore(
    (store) => store.messageBlocks?.[messageBlockIndex]?.content.title,
    deepEqual,
  );

  if (!title) return null;

  const queryWordsCount = title.split(" ").length;
  const queryCharactersCount = title.length;

  return (
    <div className="x-mx-2 x-flex x-items-center x-gap-2 x-text-xs x-font-medium x-text-muted-foreground">
      {queryWordsCount} {t("common:misc.words")} | {queryCharactersCount}{" "}
      {t("common:misc.characters")}
    </div>
  );
}
