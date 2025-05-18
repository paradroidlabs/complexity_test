import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { removeCachedRemoteResources } from "@/data/query-client/utils";
import useToggleButtonText from "@/hooks/useToggleButtonText";

export default function ClearRemoteResourcesCache() {
  const queryClient = useQueryClient();

  const [buttonText, setButtonText] = useToggleButtonText({
    defaultText: "Clear cache",
  });

  return (
    <Button
      variant="outline"
      onClick={() => {
        removeCachedRemoteResources({ queryClient });
        setButtonText("Cache cleared");
      }}
    >
      {buttonText}
    </Button>
  );
}
