This project supports Hot Module Replacement (HMR) for both content script UIs and extension UIs (e.g., Options Page, Popup, Sidepanel). However, please note the following caveats:

- Requires `vite` version `5.4.11` or lower (see https://github.com/crxjs/chrome-extension-tools/issues/971).
  - Workaround for this issue: https://github.com/crxjs/chrome-extension-tools/issues/971#issuecomment-2605520184
- **ALWAYS** explicitly specify the port number for the development server in `vite.config.ts`. Using an incorrect port will prevent HMR from functioning.
- **DO NOT** use inline imports within background scripts or service workers, as this will completely break HMR.
- HMR support is limited to React components and directly imported CSS modules. Changes to other assets, such as inline-imported (`?inline`) CSS modules, constants, or utility functions, will require a full page reload to take effect.
