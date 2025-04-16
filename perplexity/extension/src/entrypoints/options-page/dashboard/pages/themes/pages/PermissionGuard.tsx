import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import { InlineCode } from "@/components/ui/typography";
import { useExtensionPermissions } from "@/services/extension-permissions/useExtensionPermissions";

export default function ThemesPagePermissionGuardPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    query: { data: grandtedPermissions },
    handleGrantPermission,
  } = useExtensionPermissions();

  const hasPermissions =
    grandtedPermissions?.permissions?.includes("scripting") &&
    grandtedPermissions?.permissions?.includes("webNavigation");

  if (hasPermissions) return children;

  return (
    <div className="x:flex x:size-full x:items-center x:justify-center">
      <div className="x:flex x:flex-col x:items-center x:justify-center x:gap-4">
        <div className="x:text-center x:text-2xl x:text-balance">
          Please allow the extension to use both{" "}
          <InlineCode>scripting</InlineCode> and{" "}
          <InlineCode>webNavigation</InlineCode> permission.
        </div>
        <Tooltip
          content={
            <div className="x:p-2 x:text-balance">
              Instead of inserting <InlineCode>&lt;style&gt;</InlineCode> tags,
              Complexity uses <InlineCode>scripting</InlineCode> and{" "}
              <InlineCode>webNavigation</InlineCode> permissions to inject
              styles before the page loads. This results in a smooth,
              flicker-free experience. Complexity{" "}
              <span className="x:font-semibold x:underline">ONLY</span> uses
              these permissions for theme injection - it never tracks your
              browsing history or collects any personal data. Please review the
              source code if you have further questions.
            </div>
          }
        >
          <div className="x:cursor-default x:text-sm x:text-balance x:text-muted-foreground x:underline">
            Why?
          </div>
        </Tooltip>
        <div>
          <Button
            onClick={() =>
              handleGrantPermission({
                permissions: ["scripting", "webNavigation"],
              })
            }
          >
            Grant Permission
          </Button>
        </div>
      </div>
    </div>
  );
}
