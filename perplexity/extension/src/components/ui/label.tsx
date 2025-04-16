import { type LabelHTMLAttributes } from "react";

const Label = ({
  className,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) => {
  return (
    <label
      className={cn(
        "x:text-sm x:leading-none x:font-medium x:peer-disabled:cursor-not-allowed x:peer-disabled:opacity-70",
        className,
      )}
      {...props}
    />
  );
};

Label.displayName = "Label";

export { Label };
