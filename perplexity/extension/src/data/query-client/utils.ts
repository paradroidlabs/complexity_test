import type { Query, QueryClient } from "@tanstack/react-query";
import {
  persistQueryClientSave,
  type Persister,
} from "@tanstack/react-query-persist-client";
import type { PersistedClient } from "@tanstack/react-query-persist-client";
import debounce from "lodash/debounce";

import { APP_CONFIG } from "@/app.config";
import { getQueryCacheService } from "@/data/query-client/indexed-db";
import { cplxApiQueries } from "@/services/cplx-api/query-keys";

export type QueryCacheEntry = {
  key: string;
  clientData: PersistedClient;
  timestamp: number;
};

export const persister = await createDexiePersister();

async function createDexiePersister(idbValidKey = "reactQuery") {
  const db = getQueryCacheService();

  return {
    persistClient: async (client: PersistedClient) => {
      try {
        await db.update(idbValidKey, {
          key: idbValidKey,
          clientData: client,
          timestamp: Date.now(),
        });
      } catch (error) {
        console.error("Failed to persist query client:", error);
      }
    },
    restoreClient: async () => {
      try {
        const item = await db.get(idbValidKey);

        if (!item?.clientData) {
          return undefined;
        }

        return item.clientData;
      } catch (error) {
        console.error("Failed to restore query client:", error);
        return undefined;
      }
    },
    removeClient: async () => {
      try {
        await db.delete(idbValidKey);
      } catch (error) {
        console.error("Failed to remove query client:", error);
      }
    },
  } satisfies Persister;
}

export const persistRemoteResources = debounce(
  async ({ queryClient }: { queryClient: QueryClient }) => {
    persistQueryClientSave({
      queryClient,
      persister,
      buster: APP_CONFIG.VERSION,
      dehydrateOptions: {
        shouldDehydrateQuery: (query: Query) => {
          const queryKey = query.queryKey;
          return (
            Array.isArray(queryKey) && queryKey[0] === cplxApiQueries.all()[0]
          );
        },
      },
    });
  },
  300,
);

export async function invalidateRemoteResources({
  queryClient,
}: {
  queryClient: QueryClient;
}) {
  queryClient.invalidateQueries({
    queryKey: cplxApiQueries.remoteResource.all(),
  });

  queryClient.invalidateQueries({
    queryKey: cplxApiQueries.versionedRemoteResource.all(),
  });

  persistRemoteResources({ queryClient });
}
