import { useQuery } from "@tanstack/react-query";
import type { IconType } from "react-icons";

import PplxSpace from "@/components/icons/PplxSpace";
import { useRegisteredGlobalCssEntry } from "@/plugins/_core/global-stores/global-css-store";
import { useSpaRouter } from "@/plugins/_core/main-world/spa-router/listeners.loader";
import SpaceNavigatorMobileContentWrapper from "@/plugins/space-navigator/sheet/ContentWrapper";
import { DomSelectorsService } from "@/services/cplx-api/versioned-remote-resources/dom-selectors";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";
import { parseUrl } from "@/utils/utils";

export function SpaceNavigator({ Icon = PplxSpace }: { Icon?: IconType }) {
  const { data: spaces } = useQuery(pplxApiQueries.spaces.detail());

  const url = useSpaRouter((state) => state.url);
  const spaceSlug = parseUrl(url).pathname.split("/").pop();
  const spaceName = spaces?.find(
    (space) => space.slug === spaceSlug || space.uuid === spaceSlug,
  )?.title;

  useRegisteredGlobalCssEntry({
    entryIds: ["normalize-main-query-box"],
    subscriberId: "space-navigator",
  });

  return (
    <SpaceNavigatorMobileContentWrapper>
      <button
        className="x:flex x:size-8 x:cursor-pointer x:items-center x:justify-center x:gap-1 x:rounded-lg x:text-center x:text-sm x:font-medium x:text-muted-foreground x:transition-all x:duration-150 x:outline-none x:placeholder:text-muted-foreground x:hover:bg-primary-foreground x:hover:text-foreground x:focus-visible:bg-primary-foreground x:focus-visible:outline-none x:active:scale-95 x:disabled:cursor-not-allowed x:disabled:opacity-50 x:[&>span]:!truncate"
        data-testid={DomSelectorsService.testIds.QUERY_BOX.SPACE_NAVIGATOR}
      >
        <Icon className="x:size-4" />
        {spaceName && <div className="x:hidden x:md:block">{spaceName}</div>}
      </button>
    </SpaceNavigatorMobileContentWrapper>
  );
}
