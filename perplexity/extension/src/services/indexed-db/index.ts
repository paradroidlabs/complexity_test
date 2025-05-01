import { Dexie } from "dexie";

import type { BetterCodeBlockFineGrainedOptions } from "@/data/dashboard/better-code-blocks/better-code-blocks-options.types";
import type { ExtensionData } from "@/data/dashboard/extension-data.types";
import type { PromptHistory } from "@/data/plugins/prompt-history/prompt-history.type";
import type { Theme } from "@/data/plugins/themes/theme-registry.types";
import type { QueryCacheEntry } from "@/data/query-client/utils";

export class IndexedDbService extends Dexie {
  queryCache!: Dexie.Table<QueryCacheEntry, string>;
  themes!: Dexie.Table<Theme, string>;
  betterCodeBlocks!: Dexie.Table<BetterCodeBlockFineGrainedOptions, string>;
  promptHistory!: Dexie.Table<PromptHistory, string>;

  constructor() {
    super("ComplexityDatabase");
    this.version(1).stores({
      themes: "&id, title, author",
      betterCodeBlocks: "&language",
    });

    this.version(2).stores({
      promptHistory: "&id, prompt, createdAt",
    });

    this.version(5).upgrade(async (tx) => {
      const betterCodeBlocks = await tx.table("betterCodeBlocks").toArray();
      for (const betterCodeBlock of betterCodeBlocks) {
        await tx.table("betterCodeBlocks").update(betterCodeBlock.language, {
          showLineNumbers: false,
        });
      }
    });

    this.version(6).stores({
      queryCache: "&key, timestamp",
    });
  }

  async exportAll(): Promise<ExtensionData["db"]> {
    const themes = await this.themes.toArray();
    const betterCodeBlocksFineGrainedOptions =
      await this.betterCodeBlocks.toArray();
    const promptHistory = await this.promptHistory.toArray();
    return {
      themes,
      betterCodeBlocksFineGrainedOptions,
      promptHistory,
    };
  }

  async import(data: ExtensionData["db"]) {
    await this.themes.bulkPut(data.themes);
    await this.betterCodeBlocks.bulkPut(
      data.betterCodeBlocksFineGrainedOptions,
    );
    await this.promptHistory.bulkPut(data.promptHistory);
  }

  async clearAll() {
    await this.themes.clear();
    await this.betterCodeBlocks.clear();
    await this.promptHistory.clear();
    await this.queryCache.clear();
  }
}

export const db = new IndexedDbService();
