import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { getThemeCss } from "@/utils/pplx-theme-loader-utils";
import { insertCss } from "@/utils/utils";

export default function loader() {
  asyncLoaderRegistry.register({
    id: "plugin:pplxThemeLoader",
    dependencies: ["cache:extensionSettings"],
    loader: async ({ "cache:extensionSettings": extensionSettings }) => {
      const chosenThemeId = extensionSettings.theme;
      const css = await getThemeCss(chosenThemeId);

      insertCss({
        css,
        id: "cplx-custom-theme",
      });
    },
  });
}
