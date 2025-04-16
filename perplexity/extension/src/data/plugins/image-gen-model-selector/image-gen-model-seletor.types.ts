import { imageGenModels } from "@/data/plugins/image-gen-model-selector/image-gen-models";

export type ImageGenModel = (typeof imageGenModels)[number];

export function isImageGenModelCode(
  value: string,
): value is ImageGenModel["code"] {
  return imageGenModels.some((model) => model.code === value);
}
