import { Steps as ArkSteps } from "@ark-ui/react";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";

const Steps = ArkSteps.Root;

const StepsContext = ArkSteps.Context;

const StepsList = ({
  className,
  ...props
}: ComponentProps<typeof ArkSteps.List>) => (
  <ArkSteps.List
    className={cn(
      "x:flex x:w-full x:items-center x:gap-2",
      "x:data-[orientation=vertical]:flex-col",
      className,
    )}
    {...props}
  />
);

StepsList.displayName = "StepsList";

const StepsItem = ({ className, ...props }: ArkSteps.ItemProps) => (
  <ArkSteps.Item
    className={cn(
      "x:flex x:flex-1 x:items-center x:gap-2",
      "x:data-[orientation=vertical]:w-full",
      className,
    )}
    {...props}
  />
);

StepsItem.displayName = "StepsItem";

const StepsTrigger = ({ className, ...props }: ArkSteps.TriggerProps) => (
  <ArkSteps.Trigger
    className={cn(
      "x:group x:flex x:w-full x:items-center x:gap-2 x:text-sm x:font-medium",
      "x:transition-colors x:hover:text-foreground/80",
      "x:disabled:cursor-not-allowed x:disabled:opacity-50",
      "x:focus-visible:ring-2 x:focus-visible:ring-ring x:focus-visible:ring-offset-2 x:focus-visible:outline-none",
      className,
    )}
    {...props}
  />
);

StepsTrigger.displayName = "StepsTrigger";

const StepsIndicator = ({ className, ...props }: ArkSteps.IndicatorProps) => (
  <ArkSteps.Indicator
    className={cn(
      "x:flex x:h-8 x:w-8 x:items-center x:justify-center x:rounded-full x:border-2 x:bg-background x:text-sm x:font-medium",
      "x:self-start x:transition-colors",
      "x:group-data-[state=complete]:border-primary x:group-data-[state=complete]:text-primary",
      "x:group-data-[state=current]:border-primary x:group-data-[state=current]:text-primary",
      "x:group-data-[state=upcoming]:border-muted-foreground x:group-data-[state=upcoming]:text-muted-foreground",
      className,
    )}
    {...props}
  />
);

StepsIndicator.displayName = "StepsIndicator";

const StepsSeparator = ({ className, ...props }: ArkSteps.SeparatorProps) => (
  <ArkSteps.Separator
    className={cn(
      "x:h-[2px] x:flex-1 x:bg-border",
      "x:data-[orientation=vertical]:h-8 x:data-[orientation=vertical]:w-[2px]",
      "x:group-data-[state=complete]:bg-primary",
      className,
    )}
    {...props}
  />
);

StepsSeparator.displayName = "StepsSeparator";

const StepsContent = ({ className, ...props }: ArkSteps.ContentProps) => (
  <ArkSteps.Content className={cn("x:mt-4 x:text-sm", className)} {...props} />
);

StepsContent.displayName = "StepsContent";

const StepsCompletedContent = ({
  className,
  ...props
}: ArkSteps.CompletedContentProps) => (
  <ArkSteps.CompletedContent
    className={cn("x:mt-4 x:text-sm", className)}
    {...props}
  />
);

StepsCompletedContent.displayName = "StepsCompletedContent";

const StepsPrevTrigger = ({
  children,
  ...props
}: ArkSteps.PrevTriggerProps) => (
  <ArkSteps.PrevTrigger {...props} asChild>
    <Button variant="ghost" size="lg">
      {children}
    </Button>
  </ArkSteps.PrevTrigger>
);

StepsPrevTrigger.displayName = "StepsPrevTrigger";

const StepsNextTrigger = ({
  children,
  ...props
}: ArkSteps.NextTriggerProps) => (
  <ArkSteps.NextTrigger {...props} asChild>
    <Button variant="default" size="lg">
      {children}
    </Button>
  </ArkSteps.NextTrigger>
);

StepsNextTrigger.displayName = "StepsNextTrigger";

export {
  Steps,
  StepsContext,
  StepsList,
  StepsItem,
  StepsTrigger,
  StepsIndicator,
  StepsSeparator,
  StepsContent,
  StepsCompletedContent,
  StepsPrevTrigger,
  StepsNextTrigger,
};
