import { ExtensionPermissionsService } from "@/services/extension-permissions";

export function setupOptionPageListeners() {
  ExtensionPermissionsService.setupReactiveListeners();

  const theme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

  $("html").attr("data-color-scheme", theme);
}
