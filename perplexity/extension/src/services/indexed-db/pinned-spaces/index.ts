import { defineProxyService } from "@webext-core/proxy-service";

import type { PinnedSpace } from "@/data/plugins/space-navigator/pinned-space.types";
import { db } from "@/services/indexed-db";

class PinnedSpacesService {
  async add(theme: Omit<PinnedSpace, "createdAt" | "order">): Promise<string> {
    const [topSpace] = await db.pinnedSpaces
      .orderBy("[order+createdAt]")
      .reverse()
      .limit(1)
      .toArray();

    const newOrder = topSpace ? topSpace.order + 1 : 0;

    return await db.pinnedSpaces.add({
      ...theme,
      order: newOrder,
      createdAt: new Date().getTime(),
    });
  }

  async get(uuid: PinnedSpace["uuid"]): Promise<PinnedSpace | undefined> {
    return await db.pinnedSpaces.get(uuid);
  }

  async getAll(): Promise<PinnedSpace[]> {
    return await db.pinnedSpaces
      .orderBy("[order+createdAt]")
      .reverse()
      .toArray();
  }

  async update(theme: PinnedSpace): Promise<string> {
    await db.pinnedSpaces.put(theme);
    return theme.uuid;
  }

  async delete(uuid: PinnedSpace["uuid"]): Promise<void> {
    await db.pinnedSpaces.delete(uuid);
  }

  async swap({
    from,
    to,
  }: {
    from: PinnedSpace["uuid"];
    to: PinnedSpace["uuid"];
  }): Promise<void> {
    const fromSpace = await this.get(from);
    const toSpace = await this.get(to);

    if (!fromSpace || !toSpace) return;

    // fallback
    if (fromSpace.order === toSpace.order) {
      const [topSpace] = await db.pinnedSpaces
        .orderBy("[order+createdAt]")
        .reverse()
        .limit(1)
        .toArray();

      const topOrder = topSpace?.order ?? -1;

      await db.pinnedSpaces.put({ ...toSpace, order: topOrder + 2 });
      await db.pinnedSpaces.put({ ...fromSpace, order: topOrder + 1 });
      return;
    }

    await db.pinnedSpaces.put({ ...fromSpace, order: toSpace.order });
    await db.pinnedSpaces.put({ ...toSpace, order: fromSpace.order });
  }
}

export const [registerPinnedSpacesService, getPinnedSpacesService] =
  defineProxyService("PinnedSpacesService", () => new PinnedSpacesService());
