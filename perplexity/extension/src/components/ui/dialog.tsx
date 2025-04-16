import { Dialog as ArkDialog } from "@ark-ui/react";
import { type HTMLAttributes } from "react";
import React from "react";
import { LuX as X } from "react-icons/lu";

import { Portal } from "@/components/ui/portal";

export type DialogProps = ArkDialog.RootProps;

const Dialog = ArkDialog.Root;

const DialogTrigger = ArkDialog.Trigger;

const DialogPortal = Portal;

const DialogClose = ArkDialog.CloseTrigger;

const DialogOverlay = ({ className, ...props }: ArkDialog.BackdropProps) => {
  return (
    <ArkDialog.Backdrop
      className={cn(
        "x:fixed x:inset-0 x:z-50 x:bg-black/80",
        "x:data-[state=closed]:animate-out x:data-[state=open]:animate-in",
        "x:data-[state=closed]:fade-out-0 x:data-[state=open]:fade-in-0",
        className,
      )}
      {...props}
    />
  );
};

DialogOverlay.displayName = ArkDialog.Backdrop.displayName;

const DialogContent = ({
  children,
  portal = true,
  className,
  closeButton = true,
  ...props
}: ArkDialog.ContentProps & { portal?: boolean; closeButton?: boolean }) => {
  const Comp = portal ? DialogPortal : React.Fragment;

  return (
    <Comp>
      <DialogOverlay />
      <ArkDialog.Positioner>
        <ArkDialog.Content
          className={cn(
            "custom-scrollbar x:fixed x:top-[50%] x:left-[50%] x:z-50 x:flex x:max-h-[95vh] x:w-full x:max-w-lg x:flex-col x:overflow-y-auto x:fill-mode-forwards",
            "x:translate-x-[-50%] x:translate-y-[-50%] x:gap-4 x:border x:border-border/50 x:bg-background x:p-6 x:shadow-lg x:duration-200",
            "x:max-hx:-[95vh] x:data-[state=closed]:hidden x:data-[state=closed]:animate-out x:data-[state=open]:fade-in-0",
            "x:sm:rounded-lg",
            className,
          )}
          {...props}
        >
          {children}
          {closeButton && (
            <DialogClose className="x:absolute x:top-4 x:right-4 x:rounded-sm x:opacity-70 x:ring-offset-background x:transition-opacity x:hover:opacity-100 x:focus:ring-2 x:focus:ring-ring x:focus:ring-offset-2 x:focus:outline-none x:disabled:pointer-events-none x:data-[state=open]:bg-primary-foreground x:data-[state=open]:text-muted-foreground">
              <X className="x:h-4 x:w-4" />
              <span className="x:sr-only">Close</span>
            </DialogClose>
          )}
        </ArkDialog.Content>
      </ArkDialog.Positioner>
    </Comp>
  );
};

DialogContent.displayName = ArkDialog.Content.displayName;

function DialogHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("x:flex x:flex-col x:space-y-1.5", className)}
      {...props}
    />
  );
}

DialogHeader.displayName = "DialogHeader";

function DialogFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "x:flex x:flex-col-reverse x:gap-2 x:sm:flex-row x:sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

DialogFooter.displayName = "DialogFooter";

const DialogTitle = ({ className, ...props }: ArkDialog.TitleProps) => {
  return (
    <ArkDialog.Title
      className={cn(
        "x:text-lg x:leading-none x:font-semibold x:tracking-tight",
        className,
      )}
      {...props}
    />
  );
};

DialogTitle.displayName = "DialogTitle";

const DialogDescription = ({
  className,
  ...props
}: ArkDialog.DescriptionProps) => {
  return (
    <ArkDialog.Description
      className={cn("x:text-sm x:text-muted-foreground", className)}
      {...props}
    />
  );
};

DialogDescription.displayName = "DialogDescription";

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
