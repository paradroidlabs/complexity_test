import { useQuery } from "@tanstack/react-query";
import { LuFile } from "react-icons/lu";

import type { Space } from "@/services/pplx-api/pplx-api.types";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";

type AdditionalInfosProps = {
  space: Space;
};

export function AdditionalInfos({ space }: AdditionalInfosProps) {
  const { data: files } = useQuery({
    ...pplxApiQueries.spaces._ctx.files(space.uuid),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return (
    <>
      {files && files.num_total_files > 0 && (
        <div className="x:flex x:flex-shrink-0 x:items-center x:gap-1 x:rounded-md x:border x:border-border/50 x:bg-secondary x:px-2 x:py-1 x:text-xs x:text-muted-foreground x:animate-in x:fade-in">
          <span>{files.num_total_files}</span>
          <LuFile className="x:!size-3" />
        </div>
      )}
    </>
  );
}
