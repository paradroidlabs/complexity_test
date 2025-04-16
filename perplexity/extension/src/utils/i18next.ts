import i18n from "i18next";

import { whereAmI } from "@/utils/utils";

export type SupportedLangs = (typeof supportedLangs)[number];

export const supportedLangs = [
  "en-US",
  "fr-FR",
  "de-DE",
  "ja-JP",
  "ko-KR",
  "zh-CN",
  "zh-TW",
  "es-ES",
  "hi-IN",
  "it-IT",
  "pt-BR",
  "cs-CZ",
  "hr-HR",
  "hu-HU",
  "pl-PL",
  "pt-PT",
  "sk-SK",
  "sr-Cyrl-ME",
  "nl-NL",
  "el-GR",
  "ro-RO",
  "id-ID",
] as const;

export const webStoreLangsMap: Record<SupportedLangs, string> = {
  "en-US": "en",
  "fr-FR": "fr",
  "de-DE": "de",
  "ja-JP": "ja",
  "ko-KR": "ko",
  "zh-CN": "zh_CN",
  "zh-TW": "zh_TW",
  "es-ES": "es",
  "hi-IN": "hi",
  "it-IT": "it",
  "pt-BR": "pt_BR",
  "cs-CZ": "cs",
  "hr-HR": "hr",
  "hu-HU": "hu",
  "pl-PL": "pl",
  "pt-PT": "pt_PT",
  "sk-SK": "sk",
  "sr-Cyrl-ME": "sr",
  "nl-NL": "nl",
  "el-GR": "el",
  "ro-RO": "ro",
  "id-ID": "id",
};

const enModules = import.meta.glob("~/_locales/en/*.json", { eager: true });
const namespaces = Object.keys(enModules)
  .map((path) => path.split("/").pop()?.replace(".json", ""))
  .filter(Boolean) as string[];

type PluginResources = Record<string, any>;

type Resources = {
  [key: string]: PluginResources;
};

async function loadLanguageResources(
  language: string,
): Promise<PluginResources> {
  const langFolderName =
    webStoreLangsMap[language as keyof typeof webStoreLangsMap];

  const moduleImports = import.meta.glob("~/_locales/*/*.json");

  const resources: PluginResources = {};

  const importPromises: Promise<any>[] = [];
  const importKeys: string[] = [];

  Object.keys(moduleImports).forEach((path) => {
    if (path.includes(`/${langFolderName}/`)) {
      const fileName = path.split("/").pop()?.replace(".json", "");
      if (fileName) {
        const importFn = moduleImports[path];
        if (importFn) {
          importKeys.push(fileName);
          importPromises.push(importFn());
        }
      }
    }
  });

  const importedModules = await Promise.all(importPromises);

  importKeys.forEach((key, index) => {
    resources[key] = importedModules[index].default;
  });

  return resources;
}

async function getCookieLocale(
  isExtension: boolean,
): Promise<string | undefined> {
  if (isExtension) {
    if (await chrome.permissions.contains({ permissions: ["cookies"] })) {
      const cookie = await chrome.cookies.get({
        name: "pplx.chosen-locale",
        url: "https://www.perplexity.ai",
      });
      return cookie?.value;
    }
  } else {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("pplx.chosen-locale="))
      ?.split("=")[1];
  }
}

export async function getLanguage() {
  const isExtension = whereAmI() === "unknown";
  const cookieLocale = await getCookieLocale(isExtension);
  const pplxLang = cookieLocale || navigator.language || "en-US";

  return supportedLangs.includes(pplxLang as SupportedLangs)
    ? pplxLang
    : "en-US";
}

export const t = i18n.t;

export { i18n };

export async function initializeI18next() {
  const language = await getLanguage();

  const resources: Resources = {
    [language]: await loadLanguageResources(language),
  };

  if (language !== "en-US") {
    resources["en-US"] = await loadLanguageResources("en-US");
  }

  await i18n.init({
    lng: language,
    fallbackLng: "en-US",
    defaultNS: "common",
    ns: namespaces,
    resources,
  });
}
