import * as ArkAvatar from "@ark-ui/react";

const Avatar = ({ className, ...props }: ArkAvatar.AvatarRootProps) => (
  <ArkAvatar.AvatarRoot
    className={cn(
      "x:relative x:flex x:h-10 x:w-10 x:shrink-0 x:overflow-hidden x:rounded-full",
      className,
    )}
    {...props}
  />
);

Avatar.displayName = "Avatar";

const AvatarImage = ({ className, ...props }: ArkAvatar.AvatarImageProps) => (
  <ArkAvatar.AvatarImage
    className={cn("x:aspect-square x:h-full x:w-full", className)}
    {...props}
  />
);
AvatarImage.displayName = ArkAvatar.AvatarImage.displayName;

const AvatarFallback = ({
  className,
  ...props
}: ArkAvatar.AvatarFallbackProps) => (
  <ArkAvatar.AvatarFallback
    className={cn(
      "x:flex x:h-full x:w-full x:items-center x:justify-center x:rounded-full x:bg-muted",
      className,
    )}
    {...props}
  />
);
AvatarFallback.displayName = ArkAvatar.AvatarFallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
