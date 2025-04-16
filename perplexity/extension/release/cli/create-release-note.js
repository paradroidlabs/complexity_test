#!/usr/bin/env node

import { exec } from "child_process";
import fs from "fs";
import process from "process";
import { promisify } from "util";
import chalk from "chalk";

import { Logger } from "@complexity/cli-logger";
import { Command } from "commander";
import inquirer from "inquirer";

import packageJson from "../../package.json" assert { type: "json" };
import { getExtensionVersion, md5sum } from "./utils.js";

const LOGGER_NAME = packageJson.name;
const CHANGELOG_DIR = "../changelog";
const FOOTER_TEMPLATE_PATH = "./release-note-footer-template.md";

const logger = new Logger({
  name: LOGGER_NAME,
  printPrefix: false,
});

const program = new Command();

program
  .name("create-release-note")
  .description("Create a release note for the Perplexity browser extension")
  .version(packageJson.version)
  .action(main);

program.parse(process.argv);

async function main() {
  const extVersion = getExtensionVersion({ defaultVersion: packageJson });
  const changelogFile = `${CHANGELOG_DIR}/${extVersion}.md`;

  if (fs.existsSync(changelogFile)) {
    logger.info(
      `Changelog file ${chalk.yellowBright(changelogFile)} already exists`,
    );
  } else {
    const releaseNote = generateFooter(extVersion);

    fs.writeFileSync(changelogFile, releaseNote);
    logger.success(
      `Created changelog file ${chalk.yellowBright(changelogFile)}`,
    );
  }

  const { createRelease } = await inquirer.prompt([
    {
      type: "confirm",
      name: "createRelease",
      message: `Create a new GitHub release for version ${extVersion}?`,
      default: false,
    },
  ]);

  if (createRelease) {
    const tagName = `${packageJson.name}@${extVersion}`;

    const command = `gh release create "${tagName}" -t "${tagName}" --notes-file ${changelogFile} ../${extVersion}-chrome.crx ../${extVersion}-firefox.xpi`;

    const execAsync = promisify(exec);

    try {
      const { stdout } = await execAsync(command);
      console.log(stdout);

      logger.success(`Created release ${chalk.yellowBright(tagName)}`);
      logger.detail(
        `https://github.com/pnd280/complexity/releases/tag/${tagName}`,
      );
    } catch (error) {
      logger.error(`Failed to create GitHub release: ${error.message}`);
      process.exit(1);
    }
  }
}

function generateFooter(version) {
  try {
    const footerTemplate = fs.readFileSync(FOOTER_TEMPLATE_PATH, "utf8");
    const crxHash = md5sum(`../${version}-chrome.crx`);
    const xpiHash = md5sum(`../${version}-firefox.xpi`);

    return footerTemplate
      .replace("$CRX_HASH", crxHash)
      .replace("$XPI_HASH", xpiHash);
  } catch (error) {
    logger.error(`Failed to generate release note: ${error.message}`);
    throw error;
  }
}
