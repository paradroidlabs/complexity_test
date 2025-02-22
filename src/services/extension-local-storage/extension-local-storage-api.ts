import { ExtensionLocalStorage } from "@/services/extension-local-storage/extension-local-storage.types";

export class ExtensionLocalStorageApi {
  static async get(): Promise<unknown> {
    return await chrome.storage.local.get();
  }
  static async set(store: ExtensionLocalStorage) {
    await chrome.storage.local.set(store);
  }

  static async listen(
    callback: (changes: Partial<ExtensionLocalStorage>) => void,
  ) {
    chrome.storage.local.onChanged.addListener((changes) => {
      callback(changes);
    });
  }
}
