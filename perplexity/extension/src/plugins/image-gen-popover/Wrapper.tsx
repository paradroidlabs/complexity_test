import { lazily } from "react-lazily";

import { withPluginsGuard } from "@/plugins/_core/plugins-guard/withPluginsGuard";

const { ImageGenModelSelector } = lazily(
  () => import("@/plugins/image-gen-popover/ImageGenModelSelector"),
);

const ImageGenModelSelectorWrapper = withPluginsGuard(ImageGenModelSelector, {
  dependentPluginIds: ["imageGenModelSelector"],
  desktopOnly: true,
  allowedAccountTypes: [["pro"], ["pro", "enterprise"]],
});

export default ImageGenModelSelectorWrapper;
