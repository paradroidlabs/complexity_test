import { asyncLoaderRegistry } from "@/data/async-dep-registry";
import alwaysHideRelatedQuestionsCss from "@/plugins/zen-mode/always-hide-related-questions.css?inline";
import zenModeCss from "@/plugins/zen-mode/zen-mode.css?inline";
import { ExtensionSettingsService } from "@/services/extension-settings";
import { insertCss } from "@/utils/utils";

declare module "@/data/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "plugin:zenMode": void;
  }
}

export default function loader() {
  asyncLoaderRegistry.register({
    id: "plugin:zenMode",
    dependencies: ["cache:pluginsStates", "cache:extensionSettings"],
    loader: ({ "cache:pluginsStates": pluginsStates }) => {
      if (!pluginsStates["zenMode"]) return;

      insertCss({
        css: zenModeCss,
        id: "zen-mode",
      });

      const settings = ExtensionSettingsService.cachedSync;

      if (settings?.plugins["zenMode"].persistent) {
        $(document.body).attr(
          "data-cplx-zen-mode",
          settings?.plugins["zenMode"].lastState.toString() ?? "false",
        );
      }

      if (settings?.plugins["zenMode"].alwaysHideRelatedQuestions) {
        insertCss({
          css: alwaysHideRelatedQuestionsCss,
          id: "always-hide-related-questions",
        });

        $(document.body).attr(
          "data-cplx-zen-mode-always-hide-related-questions",
          "true",
        );
      }
    },
  });
}
