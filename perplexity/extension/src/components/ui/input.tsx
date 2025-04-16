import { type InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = ({ className, type, ...props }: InputProps) => {
  return (
    <input
      type={type}
      className={cn(
        "x:flex x:h-10 x:w-full x:rounded-md x:border x:border-input/50 x:bg-background x:px-3 x:py-2 x:font-sans x:text-sm x:ring-offset-background x:file:border-0 x:file:bg-transparent x:file:text-sm x:file:font-medium x:placeholder:text-muted-foreground x:focus-visible:ring-2 x:focus-visible:ring-ring x:focus-visible:ring-offset-2 x:focus-visible:outline-none x:disabled:cursor-not-allowed x:disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
};

Input.displayName = "Input";

export { Input };
