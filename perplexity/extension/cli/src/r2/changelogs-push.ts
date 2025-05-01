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

  const listingFile = path.resolve(getRootPath(), "changelogs/listing.json");

  if (!fs.existsSync(listingFile)) {
    logger.warn(`File ${listingFile} does not exist, skipping listing update`);
    process.exit(0);
  }

  const versions = JSON.parse(fs.readFileSync(listingFile, "utf8"));

  const changelogFiles = fs.readdirSync(dir);
  const changelogEntries = changelogFiles
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(".md", ""))
    .sort((a, b) =>
      semver.compare(
        semver.coerce(b, { includePrerelease: true })!,
        semver.coerce(a, { includePrerelease: true })!,
      ),
    );

  changelogEntries.forEach((entry) => {
    versions[entry] =
      versions[entry] != null
        ? versions[entry]
        : new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
  });

  const sortedVersions = Object.fromEntries(
    Object.entries(versions).sort(([a], [b]) =>
      semver.compare(
        semver.coerce(b, { includePrerelease: true })!,
        semver.coerce(a, { includePrerelease: true })!,
      ),
    ),
  );

  fs.writeFileSync(listingFile, JSON.stringify(sortedVersions, null, 2));

  logger.success(`Listing updated and sorted by semver`);

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
}
