import type { ComponentProps } from "react";

type TextareaProps = ComponentProps<"textarea">;

const Textarea = ({ className, ...props }: TextareaProps) => {
  return (
    <textarea
      className={cn(
        "x:flex x:min-h-[80px] x:w-full x:rounded-md x:border x:border-input/50 x:bg-background x:px-3 x:py-2 x:font-sans x:text-sm x:ring-offset-background x:placeholder:text-muted-foreground x:focus-visible:ring-2 x:focus-visible:ring-ring x:focus-visible:ring-offset-2 x:focus-visible:outline-none x:disabled:cursor-not-allowed x:disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
};

Textarea.displayName = "Textarea";

export { Textarea };
