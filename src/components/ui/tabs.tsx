import { Tabs as ArkTabs, useTabsContext } from "@ark-ui/react";

const Tabs = ArkTabs.Root;

const TabsTrigger = ({ value, className, ...props }: ArkTabs.TriggerProps) => {
  const { value: selectedValue } = useTabsContext();

  return (
    <ArkTabs.Trigger
      value={value}
      className={cn(
        "x-inline-flex x-items-center x-whitespace-nowrap x-rounded-md x-px-3 x-py-1.5 x-text-sm x-font-medium x-ring-offset-background x-transition-all hover:x-text-foreground focus-visible:x-outline-none focus-visible:x-ring-2 focus-visible:x-ring-ring focus-visible:x-ring-offset-2 disabled:x-pointer-events-none disabled:x-opacity-50",
        "data-[state=active]:x-bg-primary/10 data-[state=active]:x-text-primary data-[state=active]:x-shadow-sm",
        "data-[orientation=horizontal]:x-justify-center",
        "data-[orientation=vertical]:x-w-full",
        className,
      )}
      data-state={selectedValue === value ? "active" : undefined}
      {...props}
    />
  );
};

TabsTrigger.displayName = "TabsTrigger";

const TabsList = ({ className, ...props }: ArkTabs.ListProps) => (
  <ArkTabs.List
    className={cn(
      "x-inline-flex x-items-center x-justify-center x-rounded-md x-p-1 x-text-muted-foreground",
      "data-[orientation=horizontal]:x-flex-wrap",
      "data-[orientation=vertical]:x-h-max data-[orientation=vertical]:x-flex-col data-[orientation=vertical]:x-gap-1",
      className,
    )}
    {...props}
  />
);

TabsList.displayName = "TabsList";

const TabsContent = ({ className, ...props }: ArkTabs.ContentProps) => (
  <ArkTabs.Content
    className={cn(
      "x-ring-offset-background focus-visible:x-outline-none focus-visible:x-ring-2 focus-visible:x-ring-ring focus-visible:x-ring-offset-2",
      className,
    )}
    {...props}
  />
);

TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
