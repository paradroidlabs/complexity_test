import i18n from "i18next";

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

type VersionedRemoteResources = Record<string, any>;

type Resources = {
  [key: string]: VersionedRemoteResources;
};

const mainLocales = import.meta.glob("@/_locales/*/*.*.json");
const pluginLocales = import.meta.glob("@/plugins/*/_locales/*.*.json");

async function loadLanguageResources(
  language: string,
): Promise<VersionedRemoteResources> {
  const langCode = webStoreLangsMap[language as keyof typeof webStoreLangsMap];
  const resources: VersionedRemoteResources = {};

  const importPromises: Promise<any>[] = [];
  const importKeys: string[] = [];

  const allLocales = { ...mainLocales, ...pluginLocales };
  Object.keys(allLocales).forEach((path) => {
    if (path.endsWith(`.${langCode}.json`)) {
      const namespace = path.split("/").pop()?.split(".")[0];

      if (namespace) {
        const importFn = allLocales[path];
        if (importFn) {
          importKeys.push(namespace);
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

async function getCookieLocale(): Promise<string | undefined> {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("pplx.chosen-locale="))
    ?.split("=")[1];
}

export async function getLanguage() {
  const cookieLocale = await getCookieLocale();
  const pplxLang = cookieLocale || navigator.language || "en-US";

  return supportedLangs.includes(pplxLang as SupportedLangs)
    ? pplxLang
    : "en-US";
}

export const t = i18n.t;

export { i18n };

export async function initializeI18next() {
  const namespaces = new Set<string>();

  [...Object.keys(mainLocales), ...Object.keys(pluginLocales)].forEach(
    (path) => {
      if (path.endsWith(".en.json")) {
        const namespace = path.split("/").pop()?.split(".")[0];
        if (namespace) {
          namespaces.add(namespace);
        }
      }
    },
  );

  const language = await getLanguage();

  const loadPromises: Promise<VersionedRemoteResources>[] = [
    loadLanguageResources(language),
  ];
  const languagesToLoad: string[] = [language];

  if (language !== "en-US") {
    loadPromises.push(loadLanguageResources("en-US"));
    languagesToLoad.push("en-US");
  }

  const loadedResourcesArray = await Promise.all(loadPromises);

  const resources: Resources = {};
  languagesToLoad.forEach((lang, index) => {
    resources[lang] = loadedResourcesArray[index]!;
  });

  await i18n.init({
    lng: language,
    fallbackLng: "en-US",
    defaultNS: "common",
    ns: Array.from(namespaces),
    resources,
  });
}
