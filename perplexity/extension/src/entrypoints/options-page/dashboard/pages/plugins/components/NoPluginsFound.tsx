import { BiExtension } from "react-icons/bi";

import { Result } from "@/components/Result";

export default function NoPluginsFound() {
  return (
    <Result
      icon={BiExtension}
      title="No plugins found"
      description={
        <div className="x:text-balance">
          Try adjusting your search term/filters or{" "}
          <a
            href="#"
            className="x:underline x:transition-colors x:hover:text-foreground"
            target="_blank"
            rel="noreferrer"
          >
            request a new one
          </a>
        </div>
      }
    />
  );
}
