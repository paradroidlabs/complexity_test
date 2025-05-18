import {
  CallbackQueue,
  createTaskId,
} from "@/plugins/_api/dom-observer/callback-queue";
import { queryBoxesDomObserverStore } from "@/plugins/_core/dom-observers/query-boxes/store";
import { isInternalNodeExists } from "@/plugins/_core/dom-observers/utils";
import { getActiveQueryBox } from "@/plugins/_core/ui/groups/query-box/utils";

const OBSERVER_ID = {
  MAIN_QUERY_BOX: "cplx-main-query-box",
  SPACE_QUERY_BOX: "cplx-space-query-box",
  FOLLOW_UP_QUERY_BOX: "cplx-follow-up-query-box",
};

export function findMainQueryBox() {
  const existingMainQueryBox =
    queryBoxesDomObserverStore.getState().main.$mainQueryBox?.[0];

  if (
    isInternalNodeExists({
      node: existingMainQueryBox,
      selector: `[${OBSERVER_ID.MAIN_QUERY_BOX}]`,
    })
  )
    return;

  const $mainQueryBox = getActiveQueryBox({ type: "main" });

  if (!$mainQueryBox.length) return;

  $mainQueryBox.attr(OBSERVER_ID.MAIN_QUERY_BOX, "true");

  queryBoxesDomObserverStore.getState().setMainNodes({
    $mainQueryBox,
  });
}

export function findSpaceQueryBox() {
  const existingSpaceQueryBox =
    queryBoxesDomObserverStore.getState().main.$spaceQueryBox?.[0];

  if (
    isInternalNodeExists({
      node: existingSpaceQueryBox,
      selector: `[${OBSERVER_ID.SPACE_QUERY_BOX}]`,
    })
  )
    return;

  const $spaceQueryBox = getActiveQueryBox({
    type: "space",
  });

  if (!$spaceQueryBox.length) return;

  $spaceQueryBox.attr(OBSERVER_ID.SPACE_QUERY_BOX, "true");

  queryBoxesDomObserverStore.getState().setMainNodes({
    $spaceQueryBox,
  });
}

export async function findFollowUpQueryBox() {
  const existingFollowUpQueryBox =
    queryBoxesDomObserverStore.getState().followUp.$followUpQueryBox?.[0];

  if (
    isInternalNodeExists({
      node: existingFollowUpQueryBox,
      selector: `[${OBSERVER_ID.FOLLOW_UP_QUERY_BOX}]`,
    })
  )
    return;

  const $followUpQueryBox = getActiveQueryBox({
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
