import { APP_CONFIG } from "@/app.config";
import { MaybePromise } from "@/types/utils.types";
import { isInContentScript } from "@/utils/utils";

export const LOADER_IDS = [
  "lib:i18next",
  "lib:dayjs",

  "cache:extensionLocalStorage",
  "cache:pluginsStates",
  "cache:languageModels",
  "cache:betterCodeBlocksFineGrainedOptions",

  "messaging:namespaceSetup",
  "messaging:networkIntercept",
  "messaging:spaRouter",

  "coreDomObserver:sidebar",
  "coreDomObserver:home",
  "coreDomObserver:queryBoxes",
  "coreDomObserver:thread",
  "coreDomObserver:thread:messageBlocks",
  "coreDomObserver:thread:codeBlocks",
  "coreDomObserver:spacesPage",
  "coreDomObserver:settingsPage",

  "networkIntercept:pplxApi",
  "networkIntercept:languageModelSelector",

  "plugins:core",

  "plugin:cookiesNormalization",

  "plugin:pplxThemeLoader",

  "plugin:hideGetMobileAppCtaBtn",
  "plugin:zenMode",
  "plugin:blockAnalyticEvents",

  "plugin:thread:canvas:resetOpenStateOnRouteChange",
  "plugin:thread:canvas:codeBlockPlaceholdersData",
  "plugin:thread:dragAndDropFileToUploadInThread",
  "plugin:thread:rawHeadings",
  "plugin:thread:dynamicQueryFontSize",
  "plugin:thread:collapseEmptyThreadVisualCols",
  "plugin:thread:betterMessageToolbars:explicitModelName",
  "plugin:thread:betterMessageToolbars:messageWordsAndCharactersCount",
  "plugin:thread:betterMessageToolbars:collapsibleQuery",
  "plugin:thread:instantRewriteButton:nativeBtnBind",
  "plugin:thread:customThreadContainerWidth",

  "plugin:spaceNavigator:networkInterceptMiddleware",

  "plugin:queryBox:initSharedStore",
  "plugin:queryBox:languageModelSelector:respectSpaceModel",
  "plugin:queryBox:promptHistory:networkInterceptMiddleware",
  "plugin:queryBox:promptHistory:listeners",
  "plugin:queryBox:noFileCreationOnPaste",
  "plugin:queryBox:submitOnCtrlEnter",
  "plugin:queryBox:fullWidthFollowUp",

  "plugin:home:customSlogan",
  "plugin:home:hideHomepageWidgets",

  "store:colorScheme",
  "store:pplxCookies",
  "store:pluginGuards",

  "csui:root",
] as const;

type LoaderId = (typeof LOADER_IDS)[number];

type LoaderDefinition = {
  id: LoaderId;
  loader: () => MaybePromise<void>;
  dependencies?: LoaderId[];
};

class CsLoaderRegistry {
  private static instance: CsLoaderRegistry;
  private loaderMap = new Map<LoaderId, LoaderDefinition>();
  private loadedLoaders = new Set<LoaderId>();
  private loadingPromises = new Map<LoaderId, Promise<void>>();

  private constructor() {
    if (
      APP_CONFIG.IS_DEV &&
      isInContentScript() &&
      !isMainWorldContext() &&
      process.env.NODE_ENV !== "test"
    ) {
      setTimeout(() => {
        for (const loaderId of LOADER_IDS) {
          if (!CsLoaderRegistry.getInstance().isLoaderLoaded(loaderId)) {
            console.warn(
              `[ContentScriptLoaderRegistry] Loader \`${loaderId}\` hasn't loaded after 5 seconds. Ensure the callback from register() is called or the file has inline registration.`,
            );
          }
        }
      }, 5000);
    }
  }

  static getInstance() {
    if (CsLoaderRegistry.instance == null) {
      CsLoaderRegistry.instance = new CsLoaderRegistry();
    }
    return CsLoaderRegistry.instance;
  }

  getLoadedLoaders() {
    return this.loadedLoaders;
  }

  isLoaderLoaded(loaderId: LoaderId): boolean {
    return this.loadedLoaders.has(loaderId);
  }

  register(loaderConfig: LoaderDefinition) {
    if (
      (isMainWorldContext() && process.env.NODE_ENV !== "test") ||
      (!isInContentScript() && process.env.NODE_ENV !== "test")
    )
      return;

    if (this.loaderMap.has(loaderConfig.id)) {
      throw new Error(`Loader \`${loaderConfig.id}\` is already registered`);
    }

    this.loaderMap.set(loaderConfig.id, loaderConfig);
  }

  private async loadLoader(loaderId: LoaderId): Promise<void> {
    if (this.loadedLoaders.has(loaderId)) return;

    const existingPromise = this.loadingPromises.get(loaderId);
    if (existingPromise) {
      return existingPromise;
    }

    const loader = this.loaderMap.get(loaderId);
    if (!loader) {
      throw new Error(`Loader \`${loaderId}\` is not registered`);
    }

    const loadingPromise = (async () => {
      try {
        if (loader.dependencies?.length != null) {
          for (const depId of loader.dependencies) {
            await this.loadLoader(depId);
          }
        }

        await loader.loader();
        this.loadedLoaders.add(loaderId);
      } finally {
        this.loadingPromises.delete(loaderId);
      }
    })();

    this.loadingPromises.set(loaderId, loadingPromise);
    return loadingPromise;
  }

  async executeAll(): Promise<void> {
    const registeredLoaders = Array.from(this.loaderMap.keys());
    // const timings: Record<string, number> = {};

    for (const loaderId of registeredLoaders) {
      // const start = performance.now();
      await this.loadLoader(loaderId);
      // timings[loaderId] = performance.now() - start;
    }

    // const sortedLoaders = Object.entries(timings)
    //   .sort(([, a], [, b]) => b - a)
    //   .map(([id, time]) => ({
    //     id,
    //     time: Math.round(time),
    //   }));

    // console.table(sortedLoaders);
  }
}

export const csLoaderRegistry = CsLoaderRegistry.getInstance();
