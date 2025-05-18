/* --- [DO NOT REMOVE] ---
 * CRXJS treats statically imported css differently on dev vs production build
 * must keep this for tailwind to generate and hmr arbitrary classes in dev mode (this will be removed when building for prod)
 */
import "@/assets/index.css";
import "@/assets/cs.css";
/* --- [DO NOT REMOVE] --- */

import { APP_CONFIG } from "@/app.config";
import csCss from "@/assets/cs.css?inline";
import indexCss from "@/assets/index.css?inline";
import { ExtensionSettingsService } from "@/services/extension-settings";
import { getThemeCss } from "@/utils/pplx-theme-loader-utils";
import { insertCss } from "@/utils/utils";

if (!APP_CONFIG.IS_DEV) {
  insertCss({
    id: "cs-ui-root",
    css: indexCss + "\n" + csCss,
  });
}

const chosenThemeId = (
  await ExtensionSettingsService.getWithoutCacheInvalidation()
).theme;
const css = await getThemeCss(chosenThemeId);

insertCss({
  css,
  id: "cplx-custom-theme",
});
