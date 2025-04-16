import MermaidDownloadSvg from "@/plugins/canvas/components/action-buttons/Mermaid/DownloadSvg";
import MermaidOpenInPlayground from "@/plugins/canvas/components/action-buttons/Mermaid/OpenInPlayground";

export default function MermaidCanvasActionButtonsWrapper() {
  return (
    <div className="x:flex x:items-center x:gap-1">
      <MermaidDownloadSvg />
      <MermaidOpenInPlayground />
    </div>
  );
}
