<div align="center">
  <img src="public/icons/logo.svg" alt="Complexity Logo" width="120" height="120" />
</div>

<div align="center">

# Complexity

A powerful browser extension that enhances your PerplexityAI experience with advanced UI and UX improvements.

<p align="center">
  <div>
    <img src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fcdn.cplx.app%2Fversions.json&query=latest&logo=google-chrome&label=chrome" alt="Stable chrome version">
    <img src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fcdn.cplx.app%2Fversions.json&query=latestFirefox&logo=firefox&logoColor=orange&label=firefox" alt="Stable firefox version">
    <img src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fpnd280%2Fcomplexity%2Fnxt%2Fpackage.json&query=%24.version&logo=test&label=source-code&color=yellow" alt="source-code">
    <a href="https://discord.cplx.app" target="_blank"><img src="https://img.shields.io/discord/1245377426331144304?logo=discord&label=discord&link=https%3A%2F%2Fdiscord.gg%2FfxzqdkwmWx" alt="Discord"></a>
  </div>
  <div>
    <img src="https://img.shields.io/chrome-web-store/rating/ffppmilmeaekegkpckebkeahjgmhggpj?label=CWS%20rating" alt="Chrome Web Store Rating">
    <img src="https://img.shields.io/chrome-web-store/users/ffppmilmeaekegkpckebkeahjgmhggpj?label=CWS%20users" alt="Chrome Web Store Users">
    <img src="https://img.shields.io/amo/rating/complexity?label=AMO%20rating" alt="Mozilla Add-on Rating">
    <img src="https://img.shields.io/amo/users/complexity?label=AMO%20users" alt="Mozilla Add-on Users">
  </div>
</p>

<div>
  <a href="https://chromewebstore.google.com/detail/complexity/ffppmilmeaekegkpckebkeahjgmhggpj" target="_blank"><img src="https://i.imgur.com/9QWBxZO.png" width="200px" style="border-radius: .5rem"></a>
  <a href="https://addons.mozilla.org/en-US/firefox/addon/complexity/" target="_blank"><img src="https://i.imgur.com/RpP2H81.png" width="200px"></a>
  <p style="font-style: italic; font-size: .8rem;">Complexity is a third-party extension, it does NOT affiliate with Perplexity.ai.</p>
  💖 support the development
</div>

<a href="https://paypal.me/pnd280" target="_blank"><img src="https://img.shields.io/badge/Paypal-blue?logo=paypal&logoColor=white" alt="Paypal"></a>
<a href="https://ko-fi.com/pnd280" target="_blank"><img src="https://img.shields.io/badge/Ko--fi-orange?logo=kofi&logoColor=white" alt="Ko-fi"></a>

</div>

## Features

- A comprehensive set of added features and UI/UX improvements with excellent modularity and customization
- Multi-language support
- Compatible with Firefox mobile browsers.

## Quick Start

### Build and use the extension locally

Make sure you have `pnpm` and `Node.js >= v14` installed.

1. Install the dependencies

```bash
pnpm install
```

2. Build the extension (unpacked)

```bash
pnpm build
# or
pnpm build:firefox
```

3. Enable "Developer mode" in your browser

4. Load the extension from the `dist` folder

### Local development (only works on Chromium-based browsers)

```bash
pnpm dev
```

## Privacy & Security

- No data collection
- Local storage only _(Opt-in cloud sync coming soon)_

[Privacy policy](./PRIVACY.md)

## Made possible with

- Vite (+CRXJS)
- React
- JQuery
- CodeSandbox's Sandpack
- _No coffee_

## 💖 Keep the project alive

This polished and feature-rich extension is the result of countless hours of dedicated development and refinement. If you appreciate the attention to detail and ongoing improvements, please consider supporting the development through:

- [Ko-fi](https://ko-fi.com/pnd280)
- [PayPal](https://paypal.me/pnd280)

## License

This project uses a custom license allowing personal use and modifications, while prohibiting commercial use, unauthorized distribution, and feature bypassing without permission.

[Full license terms](./LICENSE)
