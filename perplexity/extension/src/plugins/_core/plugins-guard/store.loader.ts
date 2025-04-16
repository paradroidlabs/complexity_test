import { QueryObserver } from "@tanstack/react-query";

import { asyncLoaderRegistry } from "@/data/async-dep-registry";
import { isMobileStore } from "@/hooks/use-is-mobile-store";
import { spaRouteChangeCompleteSubscribe } from "@/plugins/_core/main-world/spa-router/listeners.loader";
import { pluginGuardsStore } from "@/plugins/_core/plugins-guard/store";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";
import { queryClient } from "@/utils/ts-query-client";
import { whereAmI } from "@/utils/utils";

declare module "@/data/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "store:pluginGuards": void;
  }
}

export default function loader() {
  asyncLoaderRegistry.register({
    id: "store:pluginGuards",
    dependencies: [],
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
          state.hasActiveSub = data.data.subscription_status !== "none";
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
}
