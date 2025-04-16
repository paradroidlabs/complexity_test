import { useSearchParams } from "react-router-dom";

export default function useIsFromAlpha() {
  const [searchParams] = useSearchParams();

  return searchParams.get("fromAlpha") === "true";
}
