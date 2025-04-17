import { insertCss } from "@/utils/utils";

export default async function loader() {
  insertCss({
    id: "cs-ui-root",
    css:
      (await import("@/assets/index.css?inline")).default +
      (await import("@/assets/cs.css?inline")).default,
  });
}
