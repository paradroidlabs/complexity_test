export function setupOptionPageListeners() {
  initColorScheme();
}

function initColorScheme() {
  const theme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

  $("html").attr("data-color-scheme", theme);
}
