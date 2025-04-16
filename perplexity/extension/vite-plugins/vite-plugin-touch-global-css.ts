import * as fs from "fs";

import type { Plugin } from "vite";

import { Logger } from "@complexity/cli-logger";

function touchFile(filePath: string): void {
  const time = new Date();
  fs.utimesSync(filePath, time, time);
}

type TouchGlobalCSSPluginOptions = {
  cssFilePath: string;
  watchFiles: string[];
  verbose?: boolean;
};

export default function touchGlobalCSSPlugin({
  cssFilePath,
  watchFiles,
  verbose = false,
}: TouchGlobalCSSPluginOptions): Plugin {
  const logger = new Logger({
    name: "vite-plugin-touch-global-css",
    isVerbose: verbose,
    printPrefix: true,
  });

  return {
    name: "touch-global-css",
    configureServer(server) {
      logger.verbose(`Plugin initialized, watching ${watchFiles.length} files`);

      server.watcher.on("change", (file) => {
        if (watchFiles.some((watchFile) => file.includes(watchFile))) {
          if (file.includes(cssFilePath)) return;

          touchFile(cssFilePath);
          logger.info(`Touched ${cssFilePath} due to change in ${file}`);
        }
      });
    },
  };
}
