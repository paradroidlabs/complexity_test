import { LuLoaderCircle } from "react-icons/lu";

export default function LoadingOverlay() {
  return (
    <div className="x:fixed x:inset-0 x:z-50 x:flex x:items-center x:justify-center x:bg-background/80">
      <LuLoaderCircle className="x:size-8 x:animate-spin x:text-primary" />
    </div>
  );
}
