import { Tabs as ArkTabs, useTabsContext } from "@ark-ui/react";

const Tabs = ArkTabs.Root;

const TabsTrigger = ({ value, className, ...props }: ArkTabs.TriggerProps) => {
  const { value: selectedValue } = useTabsContext();

  return (
    <ArkTabs.Trigger
      value={value}
      className={cn(
        "x:inline-flex x:items-center x:rounded-md x:px-3 x:py-1.5 x:text-sm x:font-medium x:whitespace-nowrap x:ring-offset-background x:transition-all x:hover:text-foreground x:focus-visible:ring-2 x:focus-visible:ring-ring x:focus-visible:ring-offset-2 x:focus-visible:outline-none x:disabled:pointer-events-none x:disabled:opacity-50",
        "x:data-[state=active]:bg-primary/10 x:data-[state=active]:text-primary x:data-[state=active]:shadow-sm",
        "x:data-[orientation=horizontal]:justify-center",
        "x:data-[orientation=vertical]:w-full",
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
      "x:inline-flex x:items-center x:justify-center x:rounded-md x:p-1 x:text-muted-foreground",
      "x:data-[orientation=horizontal]:flex-wrap",
      "x:data-[orientation=vertical]:h-max x:data-[orientation=vertical]:flex-col x:data-[orientation=vertical]:gap-1",
      className,
    )}
    {...props}
  />
);

TabsList.displayName = "TabsList";

const TabsContent = ({ className, ...props }: ArkTabs.ContentProps) => (
  <ArkTabs.Content
    className={cn(
      "x:ring-offset-background x:focus-visible:ring-2 x:focus-visible:ring-ring x:focus-visible:ring-offset-2 x:focus-visible:outline-none",
      className,
    )}
    {...props}
  />
);

TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
