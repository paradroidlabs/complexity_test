export function ChangelogImageComponent({
  src,
  alt,
}: {
  src?: string;
  alt?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className="x:rounded-xl x:border x:border-border/50"
    />
  );
}
