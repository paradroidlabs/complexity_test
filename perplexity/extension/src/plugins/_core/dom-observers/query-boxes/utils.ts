import {
  CallbackQueue,
  createTaskId,
} from "@/plugins/_api/dom-observer/callback-queue";
import { queryBoxesDomObserverStore } from "@/plugins/_core/dom-observers/query-boxes/store";
import { UiUtils } from "@/utils/ui-utils";

const OBSERVER_ID = {
  MAIN_QUERY_BOX: "cplx-main-query-box",
  SPACE_QUERY_BOX: "cplx-space-query-box",
  FOLLOW_UP_QUERY_BOX: "cplx-follow-up-query-box",
};

export function findMainQueryBox() {
  const id = OBSERVER_ID.MAIN_QUERY_BOX;

  const $mainQueryBox = UiUtils.getActiveQueryBox({ type: "main" });

  if (!$mainQueryBox.length || $mainQueryBox.attr(id)) return;

  $mainQueryBox.attr(id, "true");

  queryBoxesDomObserverStore.getState().setMainNodes({
    $mainQueryBox,
  });
}

export function findSpaceQueryBox() {
  if ($(`[${OBSERVER_ID.SPACE_QUERY_BOX}]`).length) return;

  const $spaceQueryBox = UiUtils.getActiveQueryBox({
    type: "space",
  });

  if (!$spaceQueryBox.length) return;

  $spaceQueryBox.attr(OBSERVER_ID.SPACE_QUERY_BOX, "true");

  queryBoxesDomObserverStore.getState().setMainNodes({
    $spaceQueryBox,
  });
}

export async function findFollowUpQueryBox() {
  if ($(`[${OBSERVER_ID.FOLLOW_UP_QUERY_BOX}]`).length) return;

  const $followUpQueryBox = UiUtils.getActiveQueryBox({
    type: "follow-up",
  });

  // Assume that the follow up query box is always visible in a thread, loop until it's visible
  if (!$followUpQueryBox.length) {
    await sleep(200);
    CallbackQueue.getInstance().enqueue(
      findFollowUpQueryBox,
      createTaskId("queryBoxes", "followUp"),
    );
    return;
  }

  $followUpQueryBox.attr(OBSERVER_ID.FOLLOW_UP_QUERY_BOX, "true");

  queryBoxesDomObserverStore.setState({
    followUp: {
      $followUpQueryBox,
    },
  });
}
