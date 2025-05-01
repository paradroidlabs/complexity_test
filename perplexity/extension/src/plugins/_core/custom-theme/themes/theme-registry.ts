import complexityBase from "@/plugins/_core/custom-theme/themes/css-files/complexity/base.css?inline";
import complexityBlue from "@/plugins/_core/custom-theme/themes/css-files/complexity/complexity-blue.css?inline";
import shyMoment from "@/plugins/_core/custom-theme/themes/css-files/complexity/shy-moment.css?inline";
import sourLemon from "@/plugins/_core/custom-theme/themes/css-files/complexity/sour-lemon.css?inline";
import type { Theme } from "@/plugins/_core/custom-theme/themes/theme-registry.types";

export type BuiltInThemeId =
  | "complexity"
  | "complexity-perplexity"
  | "complexity-shy-moment"
  | "complexity-sour-lemon";

export const BUILTIN_THEME_REGISTRY: (Theme & { id: BuiltInThemeId })[] = [
  {
    id: "complexity",
    title: "Complexity Blue",
    description: "Official DARK theme with signature blue accent color",
    author: "pnd280",
    compatibleWith: ["desktop", "mobile"],
    colorScheme: ["dark"],
    css: complexityBase + "\n" + complexityBlue,
  },
  {
    id: "complexity-shy-moment",
    title: "Shy Moment",
    description: "Official DARK theme with purple-ish accent color",
    author: "pnd280",
    compatibleWith: ["desktop", "mobile"],
    colorScheme: ["dark"],
    css: complexityBase + "\n" + shyMoment,
  },
  {
    id: "complexity-sour-lemon",
    title: "Sour Lemon",
    description: "Official DARK theme with yellow-ish accent color",
    author: "pnd280",
    compatibleWith: ["desktop", "mobile"],
    colorScheme: ["dark"],
    css: complexityBase + "\n" + sourLemon,
  },
  {
    id: "complexity-perplexity",
    title: "Perplexity Default",
    description:
      "Enhance the default theme by making thread text colors more vibrant, disable font ligatures, etc.",
    author: "pnd280",
    compatibleWith: ["desktop", "mobile"],
    colorScheme: ["light", "dark"],
    css: complexityBase,
  },
];
