#!/usr/bin/env node

import crypto from "crypto";
import fs from "fs";
import process from "process";

import chalk from "chalk";
import { Command } from "commander";
import { Logger } from "@complexity/cli-logger";

import packageJson from "../../package.json" assert { type: "json" };

const logger = new Logger({
  name: packageJson.name,
  printPrefix: false,
});

/**
 * Extract extension version from command line arguments or package.json
 *
 * @param {Object} params - The parameters
 * @param {Object} params.defaultVersion - The package.json content
 * @returns {string} The extension version
 */
export function getExtensionVersion({ defaultVersion }) {
  const program = new Command();

  program
    .option("-v, --ext-version <version>", "specify extension version")
    .parse(process.argv);

  const options = program.opts();
  const extVersion = options.extVersion || defaultVersion.version;

  logger.info(`Using extension version: ${chalk.green(extVersion)}`);

  return extVersion;
}

/**
 * Validate that the zip file exists
 *
 * @param {string} extVersion - The extension version
 * @param {string} browser - The browser name (chrome|firefox)
 * @returns {string} The validated zip path
 */
export function validateZipFile(extVersion, browser) {
  const zipPath = `../${extVersion}-${browser}.zip`;

  try {
    if (!fs.existsSync(zipPath)) {
      logger.error(`Zip file not found: ${zipPath}`);
      process.exit(1);
    }
    logger.verbose(`Found zip file: ${zipPath}`);
    return zipPath;
  } catch (err) {
    logger.error(`Error checking zip file: ${err.message}`);
    process.exit(1);
  }
}

/**
 * Calculates MD5 hash of a file
 *
 * @param {string} filePath - Path to the file
 * @returns {string} MD5 hash in hex format
 */
export function md5sum(filePath) {
  try {
    const hash = crypto.createHash("md5");
    const data = fs.readFileSync(filePath);
    hash.update(data);
    return hash.digest("hex");
  } catch (error) {
    logger.error(
      `Failed to generate MD5 hash for ${filePath}: ${error.message}`,
    );
    return "hash-calculation-failed";
  }
}
