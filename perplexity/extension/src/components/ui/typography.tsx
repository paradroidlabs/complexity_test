export function H1({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        "x:scroll-m-20 x:text-3xl x:font-extrabold x:tracking-tight x:md:text-4xl x:lg:text-5xl",
        className,
      )}
      {...props}
    />
  );
}

export function H2({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "x:scroll-m-20 x:pb-2 x:text-2xl x:font-semibold x:tracking-tight x:first:mt-0 x:md:text-3xl x:lg:text-4xl",
        className,
      )}
      {...props}
    />
  );
}

export function H3({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "x:scroll-m-20 x:text-xl x:font-semibold x:tracking-tight x:md:text-2xl x:lg:text-3xl",
        className,
      )}
      {...props}
    />
  );
}

export function H4({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h4
      className={cn(
        "x:scroll-m-20 x:text-lg x:font-semibold x:tracking-tight x:md:text-xl x:lg:text-2xl",
        className,
      )}
      {...props}
    />
  );
}

export function P({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("x:[&:not(:first-child)]:mt-6", className)} {...props} />
  );
}

export function Blockquote({
  className,
  ...props
}: React.HTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote
      className={cn("x:mt-6 x:border-l-2 x:pl-6 x:italic", className)}
      {...props}
    />
  );
}

export function InlineCode({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <code
      className={cn(
        "x:relative x:inline-block x:rounded x:bg-muted x:px-[0.3rem] x:py-[0.2rem] x:font-mono x:text-sm x:font-semibold",
        className,
      )}
      {...props}
    />
  );
}

export function Ul({
  className,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      className={cn("x:my-6 x:ml-6 x:list-disc x:[&>li]:mt-2", className)}
      {...props}
    />
  );
}
