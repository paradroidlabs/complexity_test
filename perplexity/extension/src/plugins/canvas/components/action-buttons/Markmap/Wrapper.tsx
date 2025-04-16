import DownloadAsInteractiveHtml from "@/plugins/canvas/components/action-buttons/Markmap/DownloadAsInteractiveHtml";
import OpenAsInteractiveHtml from "@/plugins/canvas/components/action-buttons/Markmap/OpenAsInteractiveHtml";

export default function MarkmapCanvasActionButtonsWrapper() {
  return (
    <div className="x:flex x:items-center x:gap-1">
      <DownloadAsInteractiveHtml />
      <OpenAsInteractiveHtml />
    </div>
  );
}
