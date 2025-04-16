export interface MainWorldCorePluginRegistry {
  webSocket: void;
}

export type MainWorldCorePluginId = keyof MainWorldCorePluginRegistry;
