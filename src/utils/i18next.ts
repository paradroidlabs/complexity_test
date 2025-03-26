import i18n from "i18next";

import { csLoaderRegistry } from "@/utils/cs-loader-registry";
import { whereAmI } from "@/utils/utils";

export type SupportedLangs = (typeof supportedLangs)[number];

export const supportedLangs = [
  "en-US",
  "fr-FR",
  "de-DE",
  "ja-JP",
  "ko-KR",
  "zh-CN",
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
  "mk-MK",
  "sr-Cyrl-ME",
  "nl-NL",
  "el-GR",
  "ro-RO",
  "id-ID",
] as const;

export const webStoreLangsMap = {
  "en-US": "en",
  "fr-FR": "fr",
  "de-DE": "de",
  "ja-JP": "ja",
  "ko-KR": "ko",
  "zh-CN": "zh_CN",
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
  "mk-MK": "mk",
  "sr-Cyrl-ME": "sr",
  "nl-NL": "nl",
  "el-GR": "el",
  "ro-RO": "ro",
  "id-ID": "id",
};

type PluginResources = {
  common: any;
  "plugin-model-selectors": any;
  "plugin-drag-n-drop-file-to-upload-in-thread": any;
  "plugin-export-thread": any;
  "plugin-better-copy-buttons": any;
  "plugin-canvas": any;
  "plugin-better-code-blocks": any;
  "plugin-on-cloudflare-timeout-reload": any;
  "plugin-command-menu": any;
  "plugin-slash-command-menu": any;
  "plugin-space-navigator": any;
};

type Resources = {
  [key: string]: PluginResources;
};

async function loadLanguageResources(
  language: string,
): Promise<PluginResources> {
  const langFolderName =
    webStoreLangsMap[language as keyof typeof webStoreLangsMap];

  const imports = {
    common: import(`~/_locales/${langFolderName}/common.json`),
    "plugin-model-selectors": import(
      `~/_locales/${langFolderName}/plugin-model-selectors.json`
    ),
    "plugin-drag-n-drop-file-to-upload-in-thread": import(
      `~/_locales/${langFolderName}/plugin-drag-n-drop-file-to-upload-in-thread.json`
    ),
    "plugin-export-thread": import(
      `~/_locales/${langFolderName}/plugin-export-thread.json`
    ),
    "plugin-better-copy-buttons": import(
      `~/_locales/${langFolderName}/plugin-better-copy-buttons.json`
    ),
    "plugin-canvas": import(`~/_locales/${langFolderName}/plugin-canvas.json`),
    "plugin-better-code-blocks": import(
      `~/_locales/${langFolderName}/plugin-better-code-blocks.json`
    ),
    "plugin-on-cloudflare-timeout-reload": import(
      `~/_locales/${langFolderName}/plugin-on-cloudflare-timeout-reload.json`
    ),
    "plugin-command-menu": import(
      `~/_locales/${langFolderName}/plugin-command-menu.json`
    ),
    "plugin-slash-command-menu": import(
      `~/_locales/${langFolderName}/plugin-slash-command-menu.json`
    ),
    "plugin-space-navigator": import(
      `~/_locales/${langFolderName}/plugin-space-navigator.json`
    ),
  };

  const results = await Promise.all(Object.values(imports));

  return Object.fromEntries(
    Object.keys(imports).map((key, index) => [key, results[index]]),
  ) as PluginResources;
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
    ns: [
      "common",
      "plugin-model-selectors",
      "plugin-drag-n-drop-file-to-upload-in-thread",
      "plugin-export-thread",
      "plugin-better-copy-buttons",
      "plugin-canvas",
      "plugin-better-code-blocks",
      "plugin-on-cloudflare-timeout-reload",
      "plugin-command-menu",
      "plugin-slash-command-menu",
      "plugin-space-navigator",
    ],
    resources,
  });
}

csLoaderRegistry.register({
  id: "lib:i18next",
  loader: initializeI18next,
});
