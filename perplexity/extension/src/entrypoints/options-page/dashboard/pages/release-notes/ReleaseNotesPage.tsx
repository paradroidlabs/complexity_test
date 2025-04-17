import { LuLoaderCircle } from "react-icons/lu";
import semver from "semver";

import ChangelogRenderer from "@/components/changelog/ChangelogRenderer";
import { useVersionPagination } from "@/entrypoints/options-page/dashboard/pages/release-notes/hooks/useVersionPagination";
import { PPLX_SCROLLBAR_CLASSES } from "@/utils/pplx-scrollbar-classes";

export function ReleaseNotesPage() {
  const { loadedVersions, hasMore, loadNextVersions, changelogQueries } =
    useVersionPagination();

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasMore && loadMoreRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            loadNextVersions();
          }
        },
        { threshold: 0.1 },
      );

      observerRef.current = observer;
      observer.observe(loadMoreRef.current);

      return () => observer.disconnect();
    }
  }, [hasMore, loadNextVersions]);

  return (
    <div className="x:flex x:flex-col x:gap-4">
      <div className="x:flex x:flex-col x:gap-2">
        <h1 className="x:text-2xl x:font-bold">Release Notes</h1>
        <p className="x:text-sm x:text-muted-foreground">
          Stay up to date with the latest changes and features.
        </p>
      </div>

      <div
        className={cn(
          "x:relative x:flex x:max-w-screen-xl x:flex-col x:gap-4 x:pb-8",
          PPLX_SCROLLBAR_CLASSES,
        )}
      >
        <div className="x:absolute x:top-4 x:bottom-4 x:left-3 x:w-[1px] x:bg-border/40" />

        {loadedVersions.map((version, index) => {
          const changelogQuery = changelogQueries[index];
          const isLoading = changelogQuery?.isLoading;
          const changelog = changelogQuery?.data;

          return (
            <div
              key={version}
              className="x:relative x:isolate x:flex x:flex-col x:gap-2 x:pl-10"
            >
              <div className="x:absolute x:-top-0.5 x:-left-0.5 x:z-10 x:box-content x:flex x:size-2.5 x:items-center x:justify-center x:rounded-full x:border-10 x:border-background x:bg-primary" />

              <div className="x:flex x:items-center x:gap-4">
                <div className="x:text-3xl x:font-semibold">
                  {semver.coerce(version)!.toString()}
                </div>
              </div>
              <div className="x:flex x:flex-col x:gap-4">
                {isLoading && (
                  <div className="x:flex x:items-center x:gap-2">
                    <LuLoaderCircle className="x:size-4 x:animate-spin" />
                    <span>Loading...</span>
                  </div>
                )}
                {changelog && <ChangelogRenderer changelog={changelog} />}
              </div>
              {index < loadedVersions.length - 1 && (
                <div className="x:mt-8 x:mb-4" />
              )}
            </div>
          );
        })}

        {hasMore && (
          <div
            ref={loadMoreRef}
            className="x:relative x:flex x:justify-center x:py-4 x:pl-10"
          >
            <div className="x:absolute x:top-4 x:left-2 x:z-10 x:flex x:size-2.5 x:items-center x:justify-center x:rounded-full x:border-2 x:border-muted-foreground/30 x:bg-background">
              <LuLoaderCircle className="x:size-2.5 x:animate-spin x:text-muted-foreground" />
            </div>
            <div className="x:sr-only">Loading more versions...</div>
          </div>
        )}

        {!hasMore && loadedVersions.length > 0 && (
          <div className="x:relative x:py-4 x:pl-10 x:text-center x:text-sm x:text-muted-foreground">
            <div className="x:absolute x:top-4 x:left-2 x:z-10 x:flex x:size-2.5 x:items-center x:justify-center x:rounded-full x:border x:border-muted-foreground/30 x:bg-background" />
            Wow, you really read all the way to the end! 🎊
          </div>
        )}
      </div>
    </div>
  );
}
