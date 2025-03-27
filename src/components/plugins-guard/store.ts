import { QueryObserver } from "@tanstack/react-query";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import { isMobileStore } from "@/hooks/use-is-mobile-store";
import { spaRouteChangeCompleteSubscribe } from "@/plugins/_core/spa-router/listeners";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";
import { queryClient } from "@/utils/ts-query-client";
import { whereAmI } from "@/utils/utils";

type PluginGuardsStoreType = {
  currentLocation: ReturnType<typeof whereAmI>;
  isMobile: boolean;
  isLoggedIn: boolean;
  isOrgMember: boolean;
  hasActiveSub: boolean;
};

export const pluginGuardsStore = createWithEqualityFn<PluginGuardsStoreType>()(
  subscribeWithSelector(
    immer(
      (): PluginGuardsStoreType => ({
        currentLocation: "unknown",
        isMobile: false,
        isLoggedIn: false,
        isOrgMember: false,
        hasActiveSub: false,
      }),
    ),
  ),
);

export const usePluginGuardsStore = pluginGuardsStore;

csLoaderRegistry.register({
  id: "store:pluginGuards",
  loader: () => {
    pluginGuardsStore.setState((state) => {
      state.currentLocation = whereAmI();
    });

    spaRouteChangeCompleteSubscribe((url) => {
      pluginGuardsStore.setState((state) => {
        state.currentLocation = whereAmI(url);
      });
    });

    isMobileStore.subscribe(
      (store) => store.isMobile,
      (isMobile) => {
        pluginGuardsStore.setState((state) => {
          state.isMobile = isMobile;
        });
      },
      {
        fireImmediately: true,
      },
    );

    const pplxAuthQueryObserver = new QueryObserver(
      queryClient,
      pplxApiQueries.auth,
    );

    pplxAuthQueryObserver.subscribe((data) => {
      if (data.data == null) return;

      pluginGuardsStore.setState((state) => {
        state.isLoggedIn = Object.keys(data.data).length > 0;
      });
    });

    const pplxAuthOrgStatusQueryObserver = new QueryObserver(
      queryClient,
      pplxApiQueries.auth._ctx.orgStatus,
    );

    pplxAuthOrgStatusQueryObserver.subscribe((data) => {
      if (!data.data) return;

      pluginGuardsStore.setState((state) => {
        state.isOrgMember = data.data.is_in_organization;
      });
    });

    pluginGuardsStore.subscribe(
      (state) => state.isLoggedIn,
      (isLoggedIn) => {
        new QueryObserver(queryClient, {
          ...pplxApiQueries.userSettings,
          enabled: isLoggedIn,
        }).subscribe((data) => {
          if (!data.data) return;

          pluginGuardsStore.setState((state) => {
            state.hasActiveSub = data.data.subscription_status !== "none";
          });
        });
      },
    );

    // pluginGuardsStore.subscribe((state) => console.log(state));
  },
});
