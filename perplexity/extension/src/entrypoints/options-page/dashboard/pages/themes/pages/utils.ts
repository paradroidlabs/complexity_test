import type { Oklch } from "culori";
import { oklch } from "culori";

type ColorPalette = {
  color100: string;
  color200: string;
  paleColor200: string;
};

export function generateDarkModeColorOverrides({
  color100,
  color200,
  paleColor200,
}: ColorPalette) {
  if (!color100 || !color200 || !paleColor200) {
    return "";
  }

  return `
:root[data-color-scheme="dark"] {
  --hydra-350: ${color100};
  --teal-200: ${color200};
  --pale-blue-200: ${paleColor200};

  --primary: oklch(${color100});
  --ring: oklch(${color100});
}
`;
}

type FontOverridesOptions = {
  uiFont: string;
  monoFont: string;
};

export function generateUiFontsOverrides({
  uiFont,
  monoFont,
}: FontOverridesOptions) {
  if (!uiFont && !monoFont) {
    return "";
  }

  return `
body#__next {
  ${uiFont ? `--font-fk-grotesk: "${uiFont}";` : ""}
  ${uiFont ? `--font-fk-grotesk-neue: "${uiFont}";` : ""}
  ${monoFont ? `--font-berkeley-mono: "${monoFont}";` : ""}
}
`;
}

export function generatePalette(baseColorHex: string): ColorPalette {
  const base = oklch(baseColorHex);

  if (!base) throw new Error("Invalid color");

  // reduce lightness and increase chroma
  const color200 = {
    ...base,
    l: base.l * 0.877,
    c: base.c * 1.398,
    h: base.h != null ? base.h * 1.0047 : undefined,
  };

  // significantly reduce lightness and chroma
  const paleColor200 = {
    ...base,
    l: base.l * 0.408,
    c: base.c * 0.284,
    h: base.h != null ? base.h + 2.22 : undefined,
  };

  return {
    color100: formatOklch(base),
    color200: formatOklch(color200),
    paleColor200: formatOklch(paleColor200),
  };
}

export function hexToOklchString(hex: string): string {
  const color = oklch(hex);

  if (!color) throw new Error("Invalid color");

  return formatOklch(color);
}

function formatOklch(color: Oklch) {
  return `${(color.l * 100).toFixed(2)}% ${color.c.toFixed(4)} ${color.h?.toFixed(1)}`;
}
