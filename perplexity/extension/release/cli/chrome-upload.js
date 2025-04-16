#!/usr/bin/env node

import fs from "fs";
import process from "process";

import chalk from "chalk";
import chromeWebstoreUpload from "chrome-webstore-upload";
import { Logger } from "@complexity/cli-logger";

import packageJson from "../../package.json" assert { type: "json" };
import { getExtensionVersion, validateZipFile } from "./utils.js";

const logger = new Logger({
  name: packageJson.name,
  printPrefix: false,
});

async function main() {
  const extVersion = getExtensionVersion({ defaultVersion: packageJson });
  const zipPath = validateZipFile(extVersion, "chrome");

  logger.info("Uploading the zip file to the Chrome Web Store...");

  const store = chromeWebstoreUpload({
    extensionId: process.env.EXTENSION_ID,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  });

  const zip = fs.createReadStream(zipPath);
  const response = await store.uploadExisting(zip);

  if (!response || response.uploadState !== "SUCCESS") {
    logger.error("Failed to upload the extension to the Chrome Web Store");
    console.log(response);
    process.exit(1);
  }

  logger.success("The extension has been uploaded successfully to the Chrome Web Store");

  const placeholderPath = `../${extVersion}-chrome.crx`;
  fs.writeFileSync(placeholderPath, "");

  logger.detail(
    `Permalink to download the draft CRX file:
    ${chalk.yellowBright(
      `https://chrome.google.com/webstore/download/${process.env.EXTENSION_ID}/revision/__DRAFT/package/main/crx/3`,
    )}`,
  );
}

main().catch((err) => {
  logger.error(`Unhandled error: ${err.message}`);
  process.exit(1);
});
