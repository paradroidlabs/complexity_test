import type { ComponentProps } from "react";

const Card = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    className={cn(
      "x:rounded-lg x:border x:border-border/50 x:bg-card x:text-card-foreground x:shadow-sm",
      className,
    )}
    {...props}
  />
);
Card.displayName = "Card";

const CardHeader = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    className={cn("x:flex x:flex-col x:space-y-1.5 x:p-4", className)}
    {...props}
  />
);
CardHeader.displayName = "CardHeader";

const CardTitle = ({ className, ...props }: ComponentProps<"h3">) => (
  <h3
    className={cn(
      "x:text-2xl x:leading-none x:font-semibold x:tracking-tight",
      className,
    )}
    {...props}
  />
);
CardTitle.displayName = "CardTitle";

const CardDescription = ({ className, ...props }: ComponentProps<"p">) => (
  <p
    className={cn("x:text-sm x:text-muted-foreground", className)}
    {...props}
  />
);
CardDescription.displayName = "CardDescription";

const CardContent = ({ className, ...props }: ComponentProps<"div">) => (
  <div className={cn("x:p-4 x:pt-0", className)} {...props} />
);
CardContent.displayName = "CardContent";

const CardFooter = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    className={cn("x:flex x:items-center x:p-4 x:pt-0", className)}
    {...props}
  />
);
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
