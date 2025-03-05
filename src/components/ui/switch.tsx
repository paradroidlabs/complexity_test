import { Switch as ArkSwitch } from "@ark-ui/react";
import { cva, type VariantProps } from "class-variance-authority";
import { ReactNode } from "react";

const switchVariants = cva(
  "x-inline-flex x-shrink-0 x-cursor-pointer x-items-center x-space-x-2 x-rounded-full x-bg-muted-foreground/35 x-transition-all focus-visible:x-outline-none focus-visible:x-ring-1 focus-visible:x-ring-ring focus-visible:x-ring-offset-2 focus-visible:x-ring-offset-background data-[disabled]:x-cursor-not-allowed data-[state=checked]:x-bg-primary/85 data-[disabled]:x-opacity-50 [&>span]:x-transition-all [&>span]:x-duration-150",
  {
    variants: {
      size: {
        xs: "x-h-4 x-w-7",
        sm: "x-h-5 x-w-9",
        base: "x-h-6 x-w-11",
        lg: "x-h-7 x-w-[52px]",
      },
    },
    defaultVariants: {
      size: "base",
    },
  },
);

const thumbVariants = cva(
  "x-pointer-events-none x-block x-rounded-full x-bg-background x-shadow-lg x-ring-0 dark:x-bg-foreground",
  {
    variants: {
      size: {
        xs: "x-h-2.5 x-w-2.5 data-[state=checked]:x-translate-x-[15px] data-[state=unchecked]:x-translate-x-[3px]",
        sm: "x-h-3.5 x-w-3.5 data-[state=checked]:x-translate-x-[18px] data-[state=unchecked]:x-translate-x-1",
        base: "x-h-4 x-w-4 data-[state=checked]:x-translate-x-6 data-[state=unchecked]:x-translate-x-1",
        lg: "x-h-5 x-w-5 data-[state=checked]:x-translate-x-[27px] data-[state=unchecked]:x-translate-x-0.5",
      },
    },
    defaultVariants: {
      size: "base",
    },
  },
);

const labelVariants = cva(
  "x-duration-15 x-cursor-pointer x-transition-colors data-[disabled]:x-cursor-not-allowed data-[state=unchecked]:x-text-muted-foreground data-[disabled]:x-opacity-50 hover:data-[state=unchecked]:x-text-foreground",
  {
    variants: {
      size: {
        xs: "x-text-[10px]",
        sm: "x-text-xs",
        base: "x-text-sm",
        lg: "x-text-base",
      },
    },
    defaultVariants: {
      size: "base",
    },
  },
);

type SwitchProps = ArkSwitch.RootProps &
  VariantProps<typeof switchVariants> & {
    labelClassName?: string;
    textLabel?: ReactNode;
  };

function Switch({
  textLabel,
  labelClassName,
  className,
  size,
  ...props
}: SwitchProps) {
  return (
    <ArkSwitch.Root
      className={cn("x-flex x-items-center x-space-x-2", className)}
      {...props}
    >
      <ArkSwitch.Context>
        {({ checked }) => (
          <>
            <ArkSwitch.Control className={switchVariants({ size })}>
              <ArkSwitch.Thumb className={thumbVariants({ size })} />
            </ArkSwitch.Control>
            {textLabel != null && textLabel !== "" && (
              <ArkSwitch.Label
                className={cn(
                  labelVariants({ size }),
                  {
                    "x-text-primary": checked,
                  },
                  labelClassName,
                )}
              >
                {textLabel}
              </ArkSwitch.Label>
            )}
            <ArkSwitch.HiddenInput />
          </>
        )}
      </ArkSwitch.Context>
    </ArkSwitch.Root>
  );
}

Switch.displayName = "Switch";

export { Switch };
