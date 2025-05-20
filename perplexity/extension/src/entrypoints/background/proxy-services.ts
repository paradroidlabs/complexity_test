function register(entries: Record<string, Record<string, unknown>>) {
  for (const [path, module] of Object.entries(entries)) {
    if (!("registerService" in module)) continue;

    const registerService = module.registerService;

    if (typeof registerService !== "function") {
      throw new Error(`registerService is not a function in ${path}`);
    }

    registerService();
  }
}

export function registerIndexedDbProxyServices() {
  const entries = import.meta.glob("@/**/indexed-db/index.ts", {
    eager: true,
  }) as Record<string, Record<string, unknown>>;

  register(entries);
}

export function registerProxyServices() {
  const entries = import.meta.glob("@/services/**/*.proxy-service.ts", {
    eager: true,
  }) as Record<string, Record<string, unknown>>;

  register(entries);
}
