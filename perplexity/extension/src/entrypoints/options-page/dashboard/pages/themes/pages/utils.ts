import type { Oklch } from "culori";
import { oklch } from "culori";
import dedent from "dedent";

type ColorPalette = {
  light: {
    super100: string;
    super200: string;
  };
  dark: {
    super100: string;
    super200: string;
  };
};

export function generateAccentColorOverrides({ light, dark }: ColorPalette) {
  invariant(light.super100, "light.super100 is required");
  invariant(light.super200, "light.super200 is required");
  invariant(dark.super100, "dark.super100 is required");
  invariant(dark.super200, "dark.super200 is required");

  return dedent`
    body {
      --background-super-color-100: ${light.super100};
      --background-super-color-200: ${light.super200};
      --dark-background-super-color-100: ${dark.super100};
      --dark-background-super-color-200: ${dark.super200};

      --primary: oklch(${light.super200});
      --ring: oklch(${light.super200});
    }

    :root[data-color-scheme="dark"] body {
        --primary: oklch(${dark.super200});
        --ring: oklch(${dark.super200});

        --background-super-color-100: var(--dark-background-super-color-100);
        --background-super-color-200: var(--dark-background-super-color-200);
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

  return dedent`
    body {
      ${uiFont ? `--font-fk-grotesk: "${uiFont}";` : ""}
      ${uiFont ? `--font-fk-grotesk-neue: "${uiFont}";` : ""}
      ${monoFont ? `--font-berkeley-mono: "${monoFont}";` : ""}
    }
  `;
}

export function generatePalette(baseHex: string): ColorPalette {
  const baseOklch = oklch(baseHex);

  invariant(baseOklch, "Invalid color");

  return {
    light: {
      super100: formatOklch({
        ...baseOklch,
        l: Math.min(0.95, baseOklch.l + 0.25),
        c: baseOklch.c * 0.3,
      }),
      super200: formatOklch({
        ...baseOklch,
        c: baseOklch.c || 0,
      }),
    },
    dark: {
      super100: formatOklch({
        ...baseOklch,
        l: Math.max(0.3, baseOklch.l - 0.15),
        c: (baseOklch.c || 0) * 0.9,
      }),
      super200: formatOklch({
        ...baseOklch,
        l: Math.max(0.7, baseOklch.l + 0.1),
        c: (baseOklch.c || 0) * 0.8,
      }),
    },
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
