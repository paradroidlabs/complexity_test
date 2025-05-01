import Cplx from "@/components/icons/Cplx";
import type { BuiltInThemeId } from "@/plugins/_core/custom-theme/themes/theme-registry";

const THEME_COLORS: Record<BuiltInThemeId, string> = {
  complexity: "oklch(74.37% 0.1304 255.6)",
  "complexity-perplexity": "oklch(71.56% 0.1183 209.17)",
  "complexity-shy-moment": "oklch(73.59% 0.1411 285.6)",
  "complexity-sour-lemon": "oklch(93.86% 0.0876 92.74)",
};

export function ThemeBanner({ color }: { color?: string }) {
  const shouldGlow = color != null;

  if (!color) color = THEME_COLORS["complexity-perplexity"];

  return (
    <div className="x:relative x:flex x:size-full x:items-center x:justify-center x:bg-[oklch(21.67%_0.0016_197.04)]">
      {shouldGlow && (
        <div
          className="x:absolute x:size-[50%] x:rounded-full x:blur-2xl"
          style={{
            backgroundColor: `color-mix(in srgb, ${color} 20%, transparent)`,
          }}
        />
      )}
      <Cplx
        className="x:relative x:size-[50%] x:fill-[oklch(93.34%_0.0025_106.45)]"
        primary={color}
      />
    </div>
  );
}

export const SVG_FEATURED_BANNERS: Record<BuiltInThemeId, React.ReactNode> = {
  complexity: <ThemeBanner color={THEME_COLORS.complexity} />,
  "complexity-perplexity": (
    <ThemeBanner color={THEME_COLORS["complexity-perplexity"]} />
  ),
  "complexity-shy-moment": (
    <ThemeBanner color={THEME_COLORS["complexity-shy-moment"]} />
  ),
  "complexity-sour-lemon": (
    <ThemeBanner color={THEME_COLORS["complexity-sour-lemon"]} />
  ),
};
