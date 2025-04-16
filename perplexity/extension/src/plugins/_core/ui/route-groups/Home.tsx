import { HomepageUpdateAnnouncer } from "@/components/HomepageUpdateAnnouncer";
import CsUiPluginsGuard from "@/plugins/_core/plugins-guard/CsUiPluginsGuard";
// import { SponsorHomeLink } from "@/components/SponsorHomeLink";

export default function HomepageComponents() {
  return (
    <CsUiPluginsGuard location={["home"]}>
      <HomepageUpdateAnnouncer />
      {/* <SponsorHomeLink /> */}
    </CsUiPluginsGuard>
  );
}
