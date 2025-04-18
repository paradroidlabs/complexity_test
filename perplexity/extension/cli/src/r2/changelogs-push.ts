import fs from "fs";
import path from "path";

import semver from "semver";

import { BUCKET_NAME, logger, r2Client } from "@/r2/config";
import { syncWithBucket } from "@/r2/push";
import { getRootPath } from "@/utils";

if (require.main === module) {
  const dir = path.resolve(getRootPath(), "changelogs");

  if (!fs.existsSync(dir)) {
    logger.error(`Directory ${dir} does not exist`);
    process.exit(1);
  }

  await syncWithBucket({
    client: r2Client,
    bucketName: BUCKET_NAME,
    localDir: dir,
    logger,
    prefix: "changelogs/",
  }).catch((error: Error) => {
    logger.error(`Unhandled error: ${error.message}`);
    process.exit(1);
  });

  const versionsFile = path.resolve(getRootPath(), "cdn/versions.json");

  if (!fs.existsSync(versionsFile)) {
    logger.warn(`File ${versionsFile} does not exist, skipping listing update`);
    process.exit(0);
  }

  const versions = JSON.parse(fs.readFileSync(versionsFile, "utf8"));

  const changelogFiles = fs.readdirSync(dir);
  const changelogEntries = changelogFiles
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(".md", ""))
    .sort((a, b) => semver.compare(semver.coerce(b)!, semver.coerce(a)!));

  versions.changelogEntries = changelogEntries;

  fs.writeFileSync(versionsFile, JSON.stringify(versions, null, 2));

  logger.success(`Listing updated`);
}
