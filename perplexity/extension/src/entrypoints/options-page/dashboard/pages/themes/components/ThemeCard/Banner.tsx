import {
  SVG_FEATURED_BANNERS,
  ThemeBanner,
} from "@/data/plugins/themes/svg-featured-banners";
import type { BuiltInThemeId } from "@/data/plugins/themes/theme-registry";
import type { Theme } from "@/data/plugins/themes/theme-registry.types";
import { hexToOklchString } from "@/entrypoints/options-page/dashboard/pages/themes/pages/utils";

type ThemeCardBannerProps = {
  theme: Theme;
};

export default function ThemeCardBanner({ theme }: ThemeCardBannerProps) {
  return (
    <div className="x:size-full x:transition-transform x:duration-500 x:group-hover:scale-110">
      <BannerContent theme={theme} />
    </div>
  );
}

function BannerContent({ theme }: { theme: Theme }) {
  if (theme.featuredImage) {
    return (
      <img
        src={theme.featuredImage}
        alt={theme.title}
        className="x:size-full x:object-cover"
      />
    );
  }

  const svgBanner = SVG_FEATURED_BANNERS[theme.id as BuiltInThemeId];

  if (svgBanner != null) {
    return <div className="x:h-full x:w-full">{svgBanner}</div>;
  }

  return (
    <ThemeBanner
      color={
        theme.config?.accentColor
          ? `oklch(${hexToOklchString(theme.config.accentColor)})`
          : undefined
      }
    />
  );
}
