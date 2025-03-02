import {
  PluginCategory,
  PluginTagValues,
} from "@/data/plugins-data/plugins-tags";
import { PluginId } from "@/services/extension-local-storage/plugins.types";

export type CoreObserverId = (typeof CORE_OBSERVERS)[number];

export type CorePluginId = (typeof CORE_PLUGINS)[number];

export type UiGroup = (typeof UI_GROUPS)[number];

export const CORE_OBSERVERS = [
  "coreDomObserver:home",
  "coreDomObserver:queryBoxes",
  "coreDomObserver:thread",
  "coreDomObserver:thread:messageBlocks",
  "coreDomObserver:thread:codeBlocks",
  "coreDomObserver:sidebar",
  "coreDomObserver:spacesPage",
  "coreDomObserver:settingsPage",
] as const;

export const CORE_PLUGINS = [
  "networkIntercept",
  "spaRouter",
  "webSocket",
  "reactVdom",
  "mermaidRenderer",
  "markmapRenderer",
] as const;

export const UI_GROUPS = [
  "queryBoxes:toolbar",
  "thread:messageBlocks:toolbar",
  "thread:messageBlocks:queryHoverContainer",
] as const;

export type CplxPluginMetadata = Record<
  PluginId,
  {
    id: PluginId;
    routeSegment: string;
    title: string;
    description: React.ReactNode;
    tags: PluginTagValues[];
    categories: PluginCategory[];
    uiGroup?: UiGroup[];
    dependentDomObservers?: CoreObserverId[];
    dependentCorePlugins?: CorePluginId[];
    dependentPlugins?: PluginId[];
  }
>;
