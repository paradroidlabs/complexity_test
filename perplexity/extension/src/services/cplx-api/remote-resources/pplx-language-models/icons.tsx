import {
  SiClaude,
  SiGooglegemini,
  SiOpenai,
  SiPerplexity,
} from "react-icons/si";

import DeepSeek from "@/components/icons/DeepSeek";
import FaAtom from "@/components/icons/FaAtom";
import PplxDeeperResearch from "@/components/icons/PplxDeeperResearch";
import XAiIcon from "@/components/icons/XAiIcon";
import type { LanguageModelProvider } from "@/services/cplx-api/remote-resources/pplx-language-models/types";

export const languageModelProviderIcons: Record<
  LanguageModelProvider,
  React.ElementType
> &
  Record<string, React.ElementType> = {
  Anthropic: SiClaude,
  OpenAI: SiOpenai,
  xAI: XAiIcon,
  Perplexity: SiPerplexity,
  PerplexityDeepResearch: FaAtom,
  PerplexityLabs: PplxDeeperResearch,
  Google: SiGooglegemini,
  DeepSeek: DeepSeek,
};
