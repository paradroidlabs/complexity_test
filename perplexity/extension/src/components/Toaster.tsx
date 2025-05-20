import type { ComponentProps } from "react";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { isReactNode } from "@/types/utils.types";

export function Toaster({
  viewportProps,
}: {
  viewportProps?: ComponentProps<typeof ToastViewport>;
}) {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        className,
        ...props
      }) {
        return (
          <Toast
            key={id}
            className={cn("x:mt-2 x:w-max x:font-sans", className)}
            {...props}
          >
            <div className="x:grid x:gap-1">
              {isReactNode(title) && <ToastTitle>{title}</ToastTitle>}
              {isReactNode(description) && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport {...viewportProps} />
    </ToastProvider>
  );
}
