import { asyncLoaderRegistry } from "@/data/async-dep-registry";
import { getCookie, setCookie } from "@/utils/utils";

declare module "@/data/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "plugin:cookiesNormalization": void;
  }
}

export default function loader() {
  asyncLoaderRegistry.register({
    id: "plugin:cookiesNormalization",
    dependencies: [],
    loader: () => {
      handleDeepResearchTooltipImpressions();

      handleUnifiedEngineTooltip();
    },
  });
}

function handleDeepResearchTooltipImpressions() {
  const pplxDeepResearchTooltipImpression = getCookie(
    "pplx.deep-research-tooltip-impressions",
  );

  if (
    pplxDeepResearchTooltipImpression == null ||
    Number(pplxDeepResearchTooltipImpression) < 10
  ) {
    setCookie("pplx.deep-research-tooltip-impressions", "999", 365);
  }
}

function handleUnifiedEngineTooltip() {
  const pplxUnifiedEngineTooltip = getCookie(
    "pplx.unified-engine-tooltip-shown",
  );

  if (pplxUnifiedEngineTooltip !== "true") {
    setCookie("pplx.unified-engine-tooltip-shown", "true", 365);
  }
}
