import { QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { RouterProvider } from "react-router-dom";

import { asyncLoaderRegistry } from "@/data/async-dep-registry";
import CsUiRoot from "@/plugins/_core/ui/_root/CsUiRoot";
import { createRouter } from "@/plugins/_core/ui/_root/router";
import { queryClient } from "@/utils/ts-query-client";

declare module "@/data/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "csui:root": void;
  }
}

export default function loader() {
  asyncLoaderRegistry.register({
    id: "csui:root",
    dependencies: [
      "lib:i18next",
      "lib:dayjs",
      "cache:pluginsStates",
      "cache:languageModels",
      "cache:betterCodeBlocksFineGrainedOptions",
    ],
    loader: () => {
      const $root = $("<div>")
        .attr("id", "complexity-root")
        .appendTo(document.body);

      if ($root[0] == null) return;

      const root = createRoot($root[0]);
      const router = createRouter();

      root.render(
        <QueryClientProvider client={queryClient}>
          <I18nextProvider i18n={i18n}>
            <CsUiRoot />
            <RouterProvider router={router} />
          </I18nextProvider>
        </QueryClientProvider>,
      );
    },
  });
}
