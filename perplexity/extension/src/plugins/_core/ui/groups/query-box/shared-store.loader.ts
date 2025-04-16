import { asyncLoaderRegistry } from "@/data/async-dep-registry";
import { populateDefaults } from "@/plugins/_core/ui/groups/query-box/utils";

declare module "@/data/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "plugin:queryBox:initSharedStore": void;
  }
}

export default function loader() {
  asyncLoaderRegistry.register({
    id: "plugin:queryBox:initSharedStore",
    dependencies: ["cache:languageModels"],
    loader: () => {
      populateDefaults();
    },
  });
}
