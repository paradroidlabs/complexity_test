import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export function ChangelogThumbnailImageComponent({
  src,
  alt,
}: {
  src?: string;
  alt?: string;
}) {
  if (!src) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="x:aspect-square x:max-w-[120px] x:min-w-[100px] x:flex-grow x:cursor-pointer x:overflow-hidden x:rounded-xl x:border x:border-border/50 x:md:max-w-[200px] x:md:min-w-[150px]">
          <img
            src={src}
            alt={alt}
            className="x:h-full x:w-full x:object-cover x:transition-transform x:hover:scale-105"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="x:max-w-3xl x:p-0">
        <div className="x:relative x:w-full x:overflow-hidden">
          <img
            src={src}
            alt={alt}
            className="x:h-auto x:w-full x:object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
