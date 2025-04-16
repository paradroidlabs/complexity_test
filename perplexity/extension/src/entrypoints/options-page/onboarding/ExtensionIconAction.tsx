import { H1 } from "@/components/ui/typography";
import ExtensionIconActionSelect from "@/entrypoints/options-page/dashboard/pages/settings/components/ExtensionIconActionSelect";

export default function ExtensionIconAction() {
  return (
    <div className="x:mx-auto x:flex x:max-w-2xl x:flex-col x:items-center x:gap-4 x:px-2 x:md:gap-8 x:md:px-4">
      <H1 className="x:text-center x:text-balance">Extension Icon Action</H1>
      <div className="x:w-full x:text-center x:text-balance">
        Customize the behavior when left-click the extension&apos;s icon.
      </div>

      <ExtensionIconActionSelect />

      <div className="x:max-w-[500px] x:rounded-md x:border x:border-border/50">
        <img
          src="https://i.imgur.com/UF288wx.png"
          alt="Dashboard Shortcut"
          className="x:relative x:w-full x:rounded-md x:shadow-lg"
        />
      </div>
    </div>
  );
}
