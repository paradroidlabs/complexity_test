# Extension Publication

Publication of the extension on web stores is done manually via scripts because it's not reliable to have it in a CI at the time of writing this (no end-to-end tests).

## Chrome Web Store

- Obtain API credentials from: https://github.com/fregante/chrome-webstore-upload-keys
- **Note**: The script only allows uploading new versions, not publishing them directly
- Publishing after upload is optional and can be done manually in the store
- After uploading, download and test the draft CRX file thoroughly before publication, as Chrome's review process is lengthy
- Cancel ongoing review and upload a new version if needed - if the update breaks before it's even published

## Mozilla Add-ons

- Obtain API credentials from: https://addons.mozilla.org/en-US/developers/addon/api/key/
- API Documentation: https://extensionworkshop.com/documentation/develop/web-ext-command-reference/#web-ext-sign
- **Important**: Mozilla's process uploads AND publishes simultaneously, so test the zip file thoroughly on Firefox before uploading
- Testing on Firefox is easier than on Chrome-based browsers, as Firefox maintains only ONE instance of the extension, regardless of signing status

## GitHub Releases

- After obtaining both the signed CRX and XPI files, create a new release via the command `pnpm create-release-note`
- A release note will be generated in the [`../../changelogs`](../../changelogs) directory, with the version number automatically extracted from the [`package.json`](../../package.json) file
- The script will prompt you to confirm the creation of a GitHub release
- Open the generated file and add a description of the changes
- Commit and push your changes (including the newly created changelog file) before proceeding
- Complete the process by confirming the creation of the release on GitHub

## Misc

- CLI version of the chrome web store upload script: https://github.com/fregante/chrome-webstore-upload-cli
- CI template: https://github.com/fregante/ghatemplates/blob/main/webext/release.yml
- Example of creating a folder symlink on Windows:
  ```powershell
  New-Item -ItemType SymbolicLink -Path -Target "$(pwd)\release\changelog" "$(pwd)\cdn-template\changelog"
  ```
