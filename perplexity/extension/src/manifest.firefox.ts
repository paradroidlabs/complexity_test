import { defineManifest } from "@crxjs/vite-plugin";
import type { ExtendedManifestV3Export } from "./manifest.base";
import { baseManifest } from "./manifest.base";
import { produce } from "immer";

export type MozManifest = ExtendedManifestV3Export & {
  browser_specific_settings: {
    gecko: {
      id: string;
      strict_min_version: string;
    };
  };
  background: {
    service_worker?: never;
    type: "classic" | "module";
  };
};

const defineMozManifest = defineManifest as unknown as (
  manifest: MozManifest,
) => MozManifest;

export default defineMozManifest(
  produce(baseManifest as MozManifest, (draft) => {
    draft.browser_specific_settings = {
      gecko: {
        id: "complexity@ngocdg",
        strict_min_version: "109.0",
      },
    };
    draft.background = {
      scripts: ["src/entrypoints/background/index.ts"],
      type: "module",
    };
    draft.content_scripts![0]!.run_at = "document_idle";
  }),
);
