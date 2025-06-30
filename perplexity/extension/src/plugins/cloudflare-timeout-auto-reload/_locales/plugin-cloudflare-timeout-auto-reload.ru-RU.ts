import type { LanguageMessages } from "@complexity/i18n";

export default {
  actionDialog: {
    sessionTimeoutTitle: "Сеанс завершён",
    sessionTimeoutDescription:
      "Ваш сеанс был завершён (скорее всего из-за Cloudflare)",
    reload: "Перезагрузить",
    dismiss: "Закрыть",
  },
} as const satisfies LanguageMessages;
