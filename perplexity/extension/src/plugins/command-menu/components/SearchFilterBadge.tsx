import { Badge } from "@/components/ui/badge";
import { SEARCH_FILTERS } from "@/data/plugins/command-menu/items";
import { useCommandMenuStore } from "@/data/plugins/command-menu/store";

export default function SearchFilterBadge() {
  const { filter, spacethreadTitle } = useCommandMenuStore();

  if (!filter) return null;

  return (
    <div className="x:ml-3">
      {SEARCH_FILTERS[filter].label && (
        <Badge>{SEARCH_FILTERS[filter].label}</Badge>
      )}
      {filter === "spaces-threads" && (
        <Badge className="x:line-clamp-1 x:max-w-[150px]">
          {spacethreadTitle}
        </Badge>
      )}
    </div>
  );
}
