import fs from "fs";
import path from "path";

import { glob } from "glob";

import { logger } from "@/r2/config";

type RuntimeResourceRegisterParams = {
  name: string;
  extension: string;
  callback: () => string;
  versions: string[];
};

export const cdnResourcesDir = path.resolve(
  __dirname,
  "../../../../../cdn/resources",
);

export function registerRuntimeResource(
  params: RuntimeResourceRegisterParams,
): void {
  ensureResourcesDirectoryExists();
  const resourceDir = ensureResourceDirectoryExists(params.name);

  const newResourceId = Date.now();
  const newResourceFileName = `${newResourceId}.${params.extension}`;

  const newResourceFile = path.resolve(resourceDir, newResourceFileName);
  fs.writeFileSync(newResourceFile, params.callback());

  updateResourceListing(
    resourceDir,
    params.extension,
    newResourceId,
    params.versions,
  );

  logger.info(`Registered resource ${newResourceFileName}`);
}

function ensureResourcesDirectoryExists(): void {
  if (!fs.existsSync(cdnResourcesDir)) {
    logger.error(`Resources directory ${cdnResourcesDir} does not exist`);
    process.exit(1);
  }
}

function ensureResourceDirectoryExists(resourceName: string): string {
  const resourceDir = path.resolve(cdnResourcesDir, resourceName);

  if (!fs.existsSync(resourceDir)) {
    fs.mkdirSync(resourceDir, { recursive: true });
    logger.info(`Created resource directory ${resourceDir}`);
  }

  return resourceDir;
}

function updateResourceListing(
  resourceDir: string,
  extension: string,
  resourceId: number,
  versions: string[],
): void {
  const listingFile = path.resolve(resourceDir, "listing.json");

  if (!fs.existsSync(listingFile)) {
    fs.writeFileSync(
      listingFile,
      JSON.stringify({ entries: [], ext: extension }, null, 2),
    );
  }

  const listing = JSON.parse(fs.readFileSync(listingFile, "utf8"));
  listing.entries.push({
    id: resourceId,
    versions,
  });

  listing.entries.sort((a: any, b: any) => b.id - a.id);

  fs.writeFileSync(listingFile, JSON.stringify(listing, null, 2));
}

if (require.main === module) {
  // registerRuntimeResource({
  //   name: "zen-mode-css",
  //   extension: "css",
  //   callback: () => "testtest",
  //   versions: [">=1.0.0", "<1.1.0"],
  // });

  const cssFile = await glob("*.css", {
    cwd: path.resolve(__dirname, "../../../../../src/plugins/zen-mode"),
  });

  console.log(cssFile);
}
