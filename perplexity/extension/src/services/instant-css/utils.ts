import { MatchPattern } from "@webext-core/match-patterns";

import { APP_CONFIG } from "@/app.config";

export const excludeMatchesPatterns = APP_CONFIG[
  "perplexity-ai"
].globalExcludeMatches.map((pattern) => new MatchPattern(pattern));

export const matchesPatterns = APP_CONFIG["perplexity-ai"].globalMatches.map(
  (pattern) => new MatchPattern(pattern),
);

export function isValidPplxPage(url: string) {
  return (
    matchesPatterns.some((pattern) => pattern.includes(url)) &&
    !excludeMatchesPatterns.some((pattern) => pattern.includes(url))
  );
}
