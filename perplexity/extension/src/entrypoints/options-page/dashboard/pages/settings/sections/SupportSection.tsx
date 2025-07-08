import { FaEllipsisH } from "react-icons/fa";
import { LuGithub, LuMail } from "react-icons/lu";
import { SiDiscord } from "react-icons/si";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SettingsItem from "@/entrypoints/options-page/dashboard/pages/settings/SettingsItem";
import SettingsSection from "@/entrypoints/options-page/dashboard/pages/settings/SettingsSection";

export default function SupportSection() {
  return (
    <SettingsSection title="Support">
      <SettingsItem
        title="Need assistance?"
        description="Get help from the community or email support"
      >
        <div className="x:flex x:items-center x:gap-4">
          <Button asChild className="x:w-max">
            <a href="https://discord.cplx.app" target="_blank" rel="noreferrer">
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
  );
}
