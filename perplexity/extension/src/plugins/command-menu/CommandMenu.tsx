import { CommandDialog } from "@/components/ui/command";
import { useCommandMenuStore } from "@/data/plugins/command-menu/store";
import { CommandContent } from "@/plugins/command-menu/components/CommandContent";
import { CommandSearchInput } from "@/plugins/command-menu/components/CommandSearchInput";
import useBindCommandMenuHotkeys from "@/plugins/command-menu/hooks/useBindCommandMenuHotkeys";
import { useSearchFilter } from "@/plugins/command-menu/hooks/useSearchFilter";

export function CommandMenu() {
  const { open, setOpen, selectedValue, setSelectedValue } =
    useCommandMenuStore();

  const { shouldFilter } = useSearchFilter();
  useBindCommandMenuHotkeys();

  return (
    <CommandDialog
      open={open}
      preventScroll={false}
      commandProps={{
        value: selectedValue,
        onValueChange: setSelectedValue,
        filter(value, search, keywords) {
          const extendValue = value + (keywords?.join("") ?? "");
          const normalizedSearch = search.replace(/\s+/g, "").toLowerCase();
          return extendValue.includes(normalizedSearch) ? 1 : 0;
        },
        shouldFilter,
      }}
      onOpenChange={({ open }) => setOpen(open)}
    >
      <CommandSearchInput />
      <CommandContent />
    </CommandDialog>
  );
}
