import { FaEllipsisH } from "react-icons/fa";
import { LuGithub, LuLeafyGreen, LuMail } from "react-icons/lu";
import { SiDiscord } from "react-icons/si";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import ClearAllDataButton from "@/entrypoints/options-page/dashboard/pages/settings/components/ClearAllDataButton";
import ExportDataButtons from "@/entrypoints/options-page/dashboard/pages/settings/components/ExportDataButtons";
import ExtensionIconActionSelect from "@/entrypoints/options-page/dashboard/pages/settings/components/ExtensionIconActionSelect";
import ImportDataButtons from "@/entrypoints/options-page/dashboard/pages/settings/components/ImportDataButtons";
import ManagePermissionsDialogWrapper from "@/entrypoints/options-page/dashboard/pages/settings/components/ManagePermissionsDialogWrapper";
import SettingsItem from "@/entrypoints/options-page/dashboard/pages/settings/SettingsItem";
import SettingsSection from "@/entrypoints/options-page/dashboard/pages/settings/SettingsSection";
import useExtensionSettings from "@/services/extension-settings/useExtensionSettings";

export function SettingsPage() {
  const navigate = useNavigate();
  const { settings, mutation } = useExtensionSettings();

  return (
    <div className="x:mx-auto x:max-w-3xl x:space-y-8">
      <SettingsSection title="General">
        <SettingsItem title="Extension Permissions">
          <ManagePermissionsDialogWrapper>
            <Button>Manage</Button>
          </ManagePermissionsDialogWrapper>
        </SettingsItem>
        <SettingsItem title="Extension Icon Action">
          <ExtensionIconActionSelect />
        </SettingsItem>
        <SettingsItem title="Show post-update release notes popup">
          <Switch
            checked={settings?.showPostUpdateReleaseNotesPopup}
            onCheckedChange={({ checked }) =>
              mutation.mutate(
                (state) => (state.showPostUpdateReleaseNotesPopup = checked),
              )
            }
          />
        </SettingsItem>
        <SettingsItem
          title={
            <div className="x:flex x:items-center x:gap-2">
              <LuLeafyGreen className="x:text-success" />
              <span>Low Performance Mode</span>
            </div>
          }
          description={
            <div>
              <div className="x:text-sm x:text-muted-foreground">
                Enable this mode if you notice significant performance issues,
                even in smaller threads.
              </div>
              <div className="x:text-sm x:text-muted-foreground x:italic">
                (Existing tabs require a refresh to apply)
              </div>
            </div>
          }
        >
          <Switch
            checked={settings?.energySavingMode}
            onCheckedChange={({ checked }) =>
              mutation.mutate((state) => (state.energySavingMode = checked))
            }
          />
        </SettingsItem>
        <SettingsItem
          title="Onboarding"
          description="Go through the onboarding experience again"
        >
          <Button onClick={() => navigate("/onboarding")}>🚀 Onboarding</Button>
        </SettingsItem>
      </SettingsSection>

      <SettingsSection title="Data">
        <SettingsItem title="Import" description="Load saved extension's data">
          <ImportDataButtons />
        </SettingsItem>
        <SettingsItem
          title="Export"
          description="Download extension's data as a file"
        >
          <ExportDataButtons />
        </SettingsItem>
      </SettingsSection>

      <SettingsSection title="Support">
        <SettingsItem
          title="Need assistance?"
          description="Get help from the community or email support"
        >
          <div className="x:flex x:items-center x:gap-4">
            <Button asChild className="x:w-max">
              <a
                href="https://discord.cplx.app"
                target="_blank"
                rel="noreferrer"
              >
                <SiDiscord className="x:mr-2 x:size-4" />
                <span>Discord</span>
              </a>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <FaEllipsisH />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild value="github">
                  <a
                    href="https://github.com/pnd280/complexity/issues"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <LuGithub className="x:mr-2 x:size-4" />
                    <span>GitHub Issues</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild value="mail">
                  <a
                    href="mailto:pnd280@gmail.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <LuMail className="x:mr-2 x:size-4" />
                    <span>pnd280@gmail.com</span>
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SettingsItem>
      </SettingsSection>

      <SettingsSection title="Troubleshooting">
        <SettingsItem title="Reset the extension">
          <ClearAllDataButton />
        </SettingsItem>
      </SettingsSection>
    </div>
  );
}
