import { defineManifest } from "@crxjs/vite-plugin";
import type { ExtendedManifestV3Export } from "./manifest.base";
import { baseManifest } from "./manifest.base";
import { produce } from "immer";

export type ChromeManifest = ExtendedManifestV3Export & {
  background: {
    service_worker: string;
    type: "module";
  };
};

const defineChromeManifest = defineManifest as unknown as (
  manifest: ChromeManifest,
) => ChromeManifest;

export default defineChromeManifest(
  produce(baseManifest as ChromeManifest, (draft) => {
    draft.background = {
      service_worker: "src/entrypoints/background/index.ts",
      type: "module",
    };
  }),
);
