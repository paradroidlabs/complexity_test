import { lazily } from "react-lazily";

import { withPluginsGuard } from "@/plugins/_core/plugins-guard/withPluginsGuard";

const { ExportThread } = lazily(
  () => import("@/plugins/export-thread/ExportThread"),
);

const ExportThreadWrapper = withPluginsGuard(ExportThread, {
  dependentPluginIds: ["thread:exportThread"],
});

export default ExportThreadWrapper;
