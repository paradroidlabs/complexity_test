import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";

import { csLoaderRegistry } from "@/utils/cs-loader-registry";
import { getLanguage, SupportedLangs } from "@/utils/i18next";

const LANGUAGE_CODES: Record<SupportedLangs, string> = {
  "en-US": "en",
  "fr-FR": "fr",
  "de-DE": "de",
  "ja-JP": "ja",
  "ko-KR": "ko",
  "zh-CN": "zh-cn",
  "es-ES": "es",
  "hi-IN": "hi",
  "it-IT": "it",
  "pt-BR": "pt-br",
  "cs-CZ": "cs",
  "hr-HR": "hr",
  "hu-HU": "hu",
  "pl-PL": "pl",
  "pt-PT": "pt",
  "sk-SK": "sk",
  "mk-MK": "mk",
  "sr-Cyrl-ME": "sr",
  "nl-NL": "nl",
  "el-GR": "el",
  "ro-RO": "ro",
  "id-ID": "id",
};

const IMPORT_MAP: Record<SupportedLangs, () => Promise<unknown>> = {
  "en-US": () => import("dayjs/locale/en"),
  "fr-FR": () => import("dayjs/locale/fr"),
  "de-DE": () => import("dayjs/locale/de"),
  "ja-JP": () => import("dayjs/locale/ja"),
  "ko-KR": () => import("dayjs/locale/ko"),
  "zh-CN": () => import("dayjs/locale/zh-cn"),
  "es-ES": () => import("dayjs/locale/es"),
  "hi-IN": () => import("dayjs/locale/hi"),
  "it-IT": () => import("dayjs/locale/it"),
  "pt-BR": () => import("dayjs/locale/pt-br"),
  "cs-CZ": () => import("dayjs/locale/cs"),
  "hr-HR": () => import("dayjs/locale/hr"),
  "hu-HU": () => import("dayjs/locale/hu"),
  "pl-PL": () => import("dayjs/locale/pl"),
  "pt-PT": () => import("dayjs/locale/pt"),
  "sk-SK": () => import("dayjs/locale/sk"),
  "mk-MK": () => import("dayjs/locale/mk"),
  "sr-Cyrl-ME": () => import("dayjs/locale/sr"),
  "nl-NL": () => import("dayjs/locale/nl"),
  "el-GR": () => import("dayjs/locale/el"),
  "ro-RO": () => import("dayjs/locale/ro"),
  "id-ID": () => import("dayjs/locale/id"),
};

dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

export function unixTimestampToDate({
  unixTimestamp,
  includeTime = true,
}: {
  unixTimestamp: number;
  includeTime?: boolean;
}) {
  return dayjs
    .unix(Math.floor(unixTimestamp / 1000))
    .local()
    .format(includeTime ? "lll" : "ll");
}

export function formatHowLongAgo(date: string) {
  return dayjs.utc(date).local().fromNow();
}

export async function initializeDayjsLocale() {
  let language = await getLanguage();

  if (!LANGUAGE_CODES[language as SupportedLangs]) {
    language = "en-US";
  }

  await IMPORT_MAP[language as SupportedLangs]?.();
  dayjs.locale(LANGUAGE_CODES[language as SupportedLangs]);
}

csLoaderRegistry.register({
  id: "lib:dayjs",
  loader: initializeDayjsLocale,
});
