import { asyncLoaderRegistry } from "@/data/async-dep-registry";
import { initializeDayjsLocale } from "@/utils/dayjs";
import { initializeI18next } from "@/utils/i18next";

declare module "@/data/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "lib:i18next": void;
    "lib:dayjs": void;
  }
}

export default function loader() {
  asyncLoaderRegistry.register({
    dependencies: [],
    id: "lib:i18next",
    loader: initializeI18next,
  });

  asyncLoaderRegistry.register({
    dependencies: [],
    id: "lib:dayjs",
    loader: initializeDayjsLocale,
  });
}
