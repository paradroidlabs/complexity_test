import { useQuery } from "@tanstack/react-query";

import PplxSpace from "@/components/icons/PplxSpace";
import { useRegisterGlobalCssEntry } from "@/plugins/_core/global-stores/global-css-store";
import { useSpaRouter } from "@/plugins/_core/main-world/spa-router/listeners.loader";
import SpaceNavigatorMobileContentWrapper from "@/plugins/space-navigator/query-box/ContentWrapper";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";
import { TEST_ID_SELECTORS } from "@/utils/dom-selectors";
import { parseUrl } from "@/utils/utils";

export function SpaceNavigator() {
  const { data: spaces } = useQuery(pplxApiQueries.spaces);

  const url = useSpaRouter((state) => state.url);
  const spaceSlug = parseUrl(url).pathname.split("/").pop();
  const spaceName = spaces?.find(
    (space) => space.slug === spaceSlug || space.uuid === spaceSlug,
  )?.title;

  useRegisterGlobalCssEntry({
    entryIds: ["normalize-main-query-box"],
    subscriberId: "space-navigator",
  });

  return (
    <SpaceNavigatorMobileContentWrapper>
      <button
        className="x:flex x:size-8 x:cursor-pointer x:items-center x:justify-center x:gap-1 x:rounded-lg x:text-center x:text-sm x:font-medium x:text-muted-foreground x:transition-all x:duration-150 x:outline-none x:placeholder:text-muted-foreground x:hover:bg-primary-foreground x:hover:text-foreground x:focus-visible:bg-primary-foreground x:focus-visible:outline-none x:active:scale-95 x:disabled:cursor-not-allowed x:disabled:opacity-50 x:[&>span]:!truncate"
        data-testid={TEST_ID_SELECTORS.QUERY_BOX.SPACE_NAVIGATOR}
      >
        <PplxSpace className="x:size-4" />
        {spaceName && <div className="x:hidden x:md:block">{spaceName}</div>}
      </button>
    </SpaceNavigatorMobileContentWrapper>
  );
}
