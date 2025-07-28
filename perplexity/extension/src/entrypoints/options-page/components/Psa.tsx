import { useQuery } from "@tanstack/react-query";

import MarkdownRenderer from "@/components/MarkdownRenderer";
import { cplxApiQueries } from "@/services/cplx-api/query-keys";

export default function Psa() {
  const { data } = useQuery(cplxApiQueries.psa.detail());

  if (!data) return null;

  return (
    <div id="psa" className="x:border-b x:bg-primary/10 x:p-4">
      <MarkdownRenderer markdown={data} className="x:text-foreground" />
    </div>
  );
}
