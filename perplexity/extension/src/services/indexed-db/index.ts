import { Dexie } from "dexie";

import type { BetterCodeBlockFineGrainedOptions } from "@/data/dashboard/better-code-blocks/better-code-blocks-options.types";
import type { ExtensionData } from "@/data/dashboard/extension-data.types";
import type { PromptHistory } from "@/data/plugins/prompt-history/prompt-history.type";
import type { PinnedSpace } from "@/data/plugins/space-navigator/pinned-space.types";
import type { Theme } from "@/data/plugins/themes/theme-registry.types";

export class IndexedDbService extends Dexie {
  themes!: Dexie.Table<Theme, string>;
  betterCodeBlocks!: Dexie.Table<BetterCodeBlockFineGrainedOptions, string>;
  promptHistory!: Dexie.Table<PromptHistory, string>;
  pinnedSpaces!: Dexie.Table<PinnedSpace, string>;

  constructor() {
    super("ComplexityDatabase");
    this.version(1).stores({
      themes: "&id, title, author",
      betterCodeBlocks: "&language",
    });

    this.version(2).stores({
      promptHistory: "&id, prompt, createdAt",
    });

    this.version(3).stores({
      pinnedSpaces: "&uuid, title, emoji, slug, createdAt",
    });

    this.version(4)
      .stores({
        pinnedSpaces: "&uuid, [order+createdAt]",
      })
      .upgrade(async (tx) => {
        const spaces = await tx.table("pinnedSpaces").toArray();
        spaces.sort((a, b) => b.createdAt - a.createdAt);

        for (let i = 0; i < spaces.length; i++) {
          const space = spaces[i];
          await tx.table("pinnedSpaces").update(space.uuid, {
            order: i,
          });
        }
      });

    this.version(5).upgrade(async (tx) => {
      const betterCodeBlocks = await tx.table("betterCodeBlocks").toArray();
      for (const betterCodeBlock of betterCodeBlocks) {
        await tx.table("betterCodeBlocks").update(betterCodeBlock.language, {
          showLineNumbers: false,
        });
      }
    });
  }

  async exportAll(): Promise<ExtensionData["db"]> {
    const themes = await this.themes.toArray();
    const betterCodeBlocksFineGrainedOptions =
      await this.betterCodeBlocks.toArray();
    const promptHistory = await this.promptHistory.toArray();
    const pinnedSpaces = await this.pinnedSpaces.toArray();
    return {
      themes,
      betterCodeBlocksFineGrainedOptions,
      promptHistory,
      pinnedSpaces,
    };
  }

  async import(data: ExtensionData["db"]) {
    await this.themes.bulkPut(data.themes);
    await this.betterCodeBlocks.bulkPut(
      data.betterCodeBlocksFineGrainedOptions,
    );
    await this.promptHistory.bulkPut(data.promptHistory);
    await this.pinnedSpaces.bulkPut(data.pinnedSpaces);
  }

  async clearAll() {
    await this.themes.clear();
    await this.betterCodeBlocks.clear();
    await this.promptHistory.clear();
    await this.pinnedSpaces.clear();
  }
}

export const db = new IndexedDbService();
