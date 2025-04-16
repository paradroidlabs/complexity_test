import { AiOutlineOpenAI } from "react-icons/ai";
import { SiGooglegemini } from "react-icons/si";

import BlackForestLabs from "@/components/icons/BlackForestLabsIcon";
import type { ImageGenModel } from "@/data/plugins/image-gen-model-selector/image-gen-model-seletor.types";

export const imageGenModelIcons: Record<
  ImageGenModel["code"],
  React.ElementType
> = {
  default: BlackForestLabs,
  "dall-e-3": AiOutlineOpenAI,
  "gemini-flash": SiGooglegemini,
};
