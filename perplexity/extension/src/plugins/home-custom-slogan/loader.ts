import { asyncLoaderRegistry } from "@/data/async-dep-registry";
import { homeDomObserverStore } from "@/plugins/_core/dom-observers/home/store";
import styles from "@/plugins/home-custom-slogan/styles.css?inline";
import { ExtensionSettingsService } from "@/services/extension-settings";
import { INTERNAL_ATTRIBUTES } from "@/utils/dom-selectors";
import { insertCss, whereAmI } from "@/utils/utils";

let removeCss: (() => void) | null = null;

function setupCustomSlogan({
  location,
  slogan,
}: {
  location: ReturnType<typeof whereAmI>;
  slogan: HTMLElement | null;
}) {
  const sloganText =
    ExtensionSettingsService.cachedSync.plugins["home:customSlogan"].slogan;

  if (sloganText.length <= 0) return;

  if (location !== "home" || slogan == null) return removeCss?.();

  removeCss = insertCss({
    css: styles,
    id: "custom-slogan",
  });

  const $slogan = $(slogan);

  if (!$slogan.length) return;

  $slogan.attr(INTERNAL_ATTRIBUTES.HOME.SLOGAN, "true");

  $slogan.find("span").text(sloganText);
}

declare module "@/data/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "plugin:home:customSlogan": void;
  }
}

export default function loader() {
  asyncLoaderRegistry.register({
    id: "plugin:home:customSlogan",
    dependencies: ["cache:pluginsStates"],
    loader: ({ "cache:pluginsStates": pluginsStates }) => {
      if (!pluginsStates["home:customSlogan"]) return;

      homeDomObserverStore.subscribe(
        (store) => store.$slogan,
        ($slogan) => {
          if (!$slogan || !$slogan[0]) return;
          setupCustomSlogan({ location: whereAmI(), slogan: $slogan[0] });
        },
      );
    },
  });
}
