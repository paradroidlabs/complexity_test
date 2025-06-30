import { type LanguageMessages } from "@complexity/i18n";

export default {
  sidecar: {
    showPreviews: "Показать превью",
    hidePreviews: "Скрыть превью",
  },
  input: {
    searchPlaceholder: "Поиск...",
  },
  actions: {
    createNewThread: "Создать новый тред",
    toggleIncognitoEnable: "Включить режим инкогнито",
    toggleIncognitoDisable: "Выключить режим инкогнито",
    toggleLightMode: "Переключить на светлый режим",
    toggleDarkMode: "Переключить на тёмный режим",
  },
  navigation: {
    home: "Главная",
    library: "Библиотека",
    spaces: "Пространства",
    discover: "Обзор",
    settings: "Настройки",
    labs: "Лаборатории",
    current: "Текущий",
    openInNewTab: "Открыть в новой вкладке",
    goTo: "Перейти к {destination}",
  },
  search: {
    threads: "Треды",
    spaces: "Пространства",
    threadsPlaceholder: "Поиск тредов...",
    spacesPlaceholder: "Поиск пространств...",
  },
  groups: {
    actions: "Действия",
    navigation: "Навигация",
    search: "Поиск",
  },
  spaces: {
    footer: {
      openInNewTab: "Открыть в новой вкладке",
      searchInSpace: "Поиск в пространстве",
      goToSpace: "Перейти в пространство",
      searchSpacePlaceholder: "Поиск {spaceName}...",
    },
    commandItems: {
      errorFetching: "Ошибка при получении пространств",
      noSpacesFound: "Пространства не найдены",
    },
    preview: {
      description: "Описание",
      instructions: "Инструкции",
      files: "Файлы ({count:number})",
      webLinks: "Веб-ссылки ({count:number})",
    },
  },
  threads: {
    commandItems: {
      errorFetching: "Ошибка при получении тредов",
      noThreadsFound: "Треды не найдены",
    },
  },
  common: {
    noResults: "Результаты не найдены",
    current: "Текущий",
  },
} as const satisfies LanguageMessages;
