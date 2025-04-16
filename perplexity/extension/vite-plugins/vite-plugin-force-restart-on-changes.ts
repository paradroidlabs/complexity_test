import * as path from "path";

import { minimatch } from "minimatch";
import type { Plugin, ViteDevServer } from "vite";

import { Logger } from "@complexity/cli-logger";
import {
  markFileAsReloaded,
  clearReloadedFile,
} from "./vite-plugin-reload-on-dynamically-injected-style-changes";

interface WatchConfig {
  folders?: string[];
  patterns?: string[];
  verbose?: boolean;
}

export default function vitePluginForceRestartOnChanges(
  config: WatchConfig | string[],
): Plugin {
  let viteServer: ViteDevServer;
  let restartTimeout: NodeJS.Timeout | null = null;
  let isRestarting = false;
  const DEBOUNCE_TIME = 1000; // 1 second debounce
  const RELOAD_DELAY = 1500; // Delay before triggering page reload

  // Handle legacy array input for backward compatibility
  const watchFolders = Array.isArray(config) ? config : (config.folders ?? []);
  const watchPatterns = Array.isArray(config) ? [] : (config.patterns ?? []);
  const isVerbose = Array.isArray(config) ? false : (config.verbose ?? false);

  const logger = new Logger({
    name: "vite-plugin-force-restart-on-changes",
    isVerbose,
    printPrefix: true,
  });

  const debouncedRestart = () => {
    if (isRestarting) {
      return;
    }

    if (restartTimeout) {
      clearTimeout(restartTimeout);
    }

    restartTimeout = setTimeout(() => {
      if (!isRestarting) {
        isRestarting = true;
        logger.info("Restarting Vite server...");

        // Notify clients that a restart is happening
        viteServer.ws.send({ type: "custom", event: "server-restart-started" });

        viteServer.restart().finally(() => {
          setTimeout(() => {
            // Trigger page reload after server is ready
            viteServer.ws.send({ type: "full-reload" });
            isRestarting = false;
            restartTimeout = null;
            logger.success("Server restart complete");
          }, RELOAD_DELAY);
        });
      }
    }, DEBOUNCE_TIME);
  };

  return {
    name: "force-reload-on-folder-changes",
    enforce: "pre",
    configureServer(server) {
      viteServer = server;
      logger.verbose("Plugin initialized with server instance");
    },
    handleHotUpdate({ file }) {
      const normalizedFile = path.normalize(file);
      const projectRoot = viteServer.config.root;

      // Check folder matches
      const folderMatch = watchFolders.some((folder) => {
        const fullFolderPath = path.normalize(path.join(projectRoot, folder));
        return normalizedFile.startsWith(fullFolderPath + path.sep);
      });

      // Check pattern matches
      const patternMatch = watchPatterns.some((pattern) => {
        const relativeFile = path.relative(projectRoot, normalizedFile);
        return minimatch(relativeFile, pattern, { matchBase: true });
      });

      if (folderMatch || patternMatch) {
        logger.info(
          `File changed in watched path: ${file}. Scheduling server restart...`,
        );
        markFileAsReloaded(normalizedFile);
        debouncedRestart();
        clearReloadedFile(normalizedFile);
        return [];
      }
    },
  };
}
