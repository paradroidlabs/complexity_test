import { lazily } from "react-lazily";

import { withPluginsGuard } from "@/plugins/_core/plugins-guard/withPluginsGuard";

const { Canvas } = lazily(() => import("@/plugins/canvas/Canvas"));

const CanvasWrapper = withPluginsGuard(Canvas, {
  dependentPluginIds: ["thread:canvas"],
});

export default CanvasWrapper;
