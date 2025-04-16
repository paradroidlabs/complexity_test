#!/usr/bin/env node

import { exec } from "child_process";
import fs from "fs";
import process from "process";
import { promisify } from "util";

import { Logger } from "@complexity/cli-logger";

import packageJson from "../../package.json" assert { type: "json" };
import { getExtensionVersion, validateZipFile } from "./utils.js";

const logger = new Logger({
  name: packageJson.name,
  printPrefix: false,
});

const extVersion = getExtensionVersion({ defaultVersion: packageJson });
const zipPath = validateZipFile(extVersion, "firefox");
const extractDir = `../${extVersion}-firefox`;

const execAsync = promisify(exec);

async function main() {
  if (fs.existsSync(extractDir)) {
    logger.verbose(`Removing existing ${extractDir}...`);
    fs.rmSync(extractDir, { recursive: true, force: true });
  }
  fs.mkdirSync(extractDir, { recursive: true });

  try {
    logger.verbose(`Extracting ${zipPath} to ${extractDir}...`);
    await execAsync(`unzip -o "${zipPath}" -d "${extractDir}"`);

    logger.info("Signing extension...");
    const { stdout } = await execAsync(
      `web-ext sign --channel listed --source-dir "${extractDir}" --artifacts-dir ..`,
    );
    console.log(stdout);

    logger.verbose("Renaming XPI file...");
    const xpiFile = `../complexity-${extVersion}.xpi`;

    if (!fs.existsSync(xpiFile)) {
      logger.error(`XPI file not found: ${xpiFile}`);
    } else {
      const newName = `${extVersion}-firefox.xpi`;
      fs.renameSync(xpiFile, `../${newName}`);
      logger.verbose(`Renamed complexity-${extVersion}.xpi to ${newName}`);
    }

    cleanup();

    logger.success(
      "The add-on has been uploaded successfully to the Mozilla Add-ons Store",
    );
    logger.detail(
      `Please visit https://addons.mozilla.org/en-US/developers/addon/complexity/versions/${extVersion} to add Android as a supported platform`,
    );
  } catch (err) {
    logger.error(`Error: ${err.message}`);
    cleanup();
    process.exit(1);
  }
}

function cleanup() {
  logger.verbose("Cleaning up...");
  fs.rmSync(extractDir, { recursive: true, force: true });
}

main().catch((err) => {
  logger.error(`Unhandled error: ${err.message}`);
  process.exit(1);
});
