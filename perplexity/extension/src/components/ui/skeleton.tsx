function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("x:animate-pulse x:rounded-md x:bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
