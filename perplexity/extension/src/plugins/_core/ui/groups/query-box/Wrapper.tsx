import FollowUpQueryBoxWrapper from "@/plugins/_core/ui/groups/query-box/FollowUp";
import MainQueryBoxWrapper from "@/plugins/_core/ui/groups/query-box/Main";
import SpaceQueryBoxWrapper from "@/plugins/_core/ui/groups/query-box/Space";
import type { UiGroupId } from "@/plugins/_core/ui/groups/types";
import { shouldEnableUiGroup } from "@/plugins/_core/ui/groups/utils";

export function QueryBoxComponents() {
  const shouldEnable = useMemo(
    () =>
      (
        [
          "queryBoxes:toolbar:main",
          "queryBoxes:toolbar:followUp",
        ] satisfies UiGroupId[]
      ).some((uiGroup) => shouldEnableUiGroup({ uiGroup })),
    [],
  );

  if (!shouldEnable) {
    return null;
  }

  return (
    <>
      <MainQueryBoxWrapper />
      <SpaceQueryBoxWrapper />
      <FollowUpQueryBoxWrapper />
    </>
  );
}
