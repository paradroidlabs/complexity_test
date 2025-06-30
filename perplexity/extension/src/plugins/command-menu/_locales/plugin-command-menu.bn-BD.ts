import { type LanguageMessages } from "@complexity/i18n";

export default {
  sidecar: {
    showPreviews: "প্রিভিউ দেখান",
    hidePreviews: "প্রিভিউ লুকান",
  },
  input: {
    searchPlaceholder: "অনুসন্ধান...",
  },
  actions: {
    createNewThread: "নতুন থ্রেড তৈরি করুন",
    toggleIncognitoEnable: "ইনকগনিটো মোড চালু করুন",
    toggleIncognitoDisable: "ইনকগনিটো মোড বন্ধ করুন",
    toggleLightMode: "লাইট মোডে পরিবর্তন করুন",
    toggleDarkMode: "ডার্ক মোডে পরিবর্তন করুন",
  },
  navigation: {
    home: "হোম",
    library: "লাইব্রেরি",
    spaces: "স্পেসেস",
    discover: "ডিসকভার",
    settings: "সেটিংস",
    labs: "ল্যাবস",
    current: "বর্তমান",
    openInNewTab: "নতুন ট্যাবে খুলুন",
    goTo: "যান {destination}",
  },
  search: {
    threads: "থ্রেডস",
    spaces: "স্পেসেস",
    threadsPlaceholder: "থ্রেড অনুসন্ধান...",
    spacesPlaceholder: "স্পেস অনুসন্ধান...",
  },
  groups: {
    actions: "কর্মসমূহ",
    navigation: "নেভিগেশন",
    search: "অনুসন্ধান",
  },
  spaces: {
    footer: {
      openInNewTab: "নতুন ট্যাবে খুলুন",
      searchInSpace: "স্পেসে অনুসন্ধান করুন",
      goToSpace: "স্পেসে যান",
      searchSpacePlaceholder: "অনুসন্ধান করুন {spaceName}...",
    },
    commandItems: {
      errorFetching: "স্পেস আনতে সমস্যা হয়েছে",
      noSpacesFound: "কোনো স্পেস পাওয়া যায়নি",
    },
    preview: {
      description: "বর্ণনা",
      instructions: "নির্দেশনা",
      files: "ফাইল ({count:number})",
      webLinks: "ওয়েব লিঙ্ক ({count:number})",
    },
  },
  threads: {
    commandItems: {
      errorFetching: "থ্রেড আনতে সমস্যা হয়েছে",
      noThreadsFound: "কোনো থ্রেড পাওয়া যায়নি",
    },
  },
  common: {
    noResults: "কোনো ফলাফল পাওয়া যায়নি",
    current: "বর্তমান",
  },
} as const satisfies LanguageMessages;
