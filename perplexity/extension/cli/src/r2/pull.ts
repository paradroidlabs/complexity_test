import fs from "fs";
import path from "path";
import process from "process";

import { GetObjectCommand } from "@aws-sdk/client-s3";
import type { S3Client } from "@aws-sdk/client-s3";
import type { Logger } from "@complexity/cli-logger";
import chalk from "chalk";

import { r2Client, BUCKET_NAME, logger } from "@/r2/config";
import {
  calculateFileHash,
  getBucketObjects,
  ensureDirectoryExists,
  removePrefixes,
} from "@/r2/utils";
import { getRootPath } from "@/utils";

type PullBucketParams = {
  r2Client: S3Client;
  bucketName: string;
  pullDir?: string;
  logger: Logger;
  prefix?: string;
  ignore?: string[];
};

export async function pullBucket({
  r2Client,
  bucketName,
  pullDir,
  logger,
  prefix,
  ignore = [],
}: PullBucketParams): Promise<void> {
  if (!pullDir) {
    logger.error("pullDir is not set. Aborting pull.");
    process.exit(1);
  }

  try {
    if (!ensureDirectoryExists({ dir: pullDir, logger })) {
      return;
    }

    logger.info(
      `Starting pull from bucket ${chalk.blue(bucketName)} to ${chalk.blue(pullDir)}...`,
    );

    if (ignore.length > 0) {
      logger.info(`Ignoring prefixes: ${chalk.yellow(ignore.join(", "))}`);
    }

    const bucketObjects = await getBucketObjects({
      client: r2Client,
      bucketName,
      prefix,
      ignore,
    });
    const bucketKeys = Object.keys(bucketObjects);

    if (bucketKeys.length === 0) {
      logger.info("No objects found in bucket.");
      return;
    }

    logger.info(
      `Found ${chalk.blue(bucketKeys.length.toString())} objects in bucket`,
    );

    let pulledCount = 0;
    let skippedCount = 0;

    for (const key of bucketKeys) {
      const remoteHash = bucketObjects[key];

      // Collect all prefixes that should be removed from the path
      const prefixesToRemove = [prefix]
        .concat(ignore)
        .filter(Boolean) as string[];
      const localKey = removePrefixes({ key, prefixes: prefixesToRemove });

      const filePath = path.join(pullDir, localKey);
      const localHash = calculateFileHash({ filePath });

      if (fs.existsSync(filePath) && localHash === remoteHash) {
        logger.verbose(`Skipping (unchanged): ${chalk.cyan(key)}`);
        skippedCount++;
        continue;
      }

      logger.verbose(`Pulling: ${chalk.cyan(key)}`);

      const getCommand = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
      });

      try {
        const response = await r2Client.send(getCommand);

        if (!response.Body) {
          logger.warn(`No body returned for ${chalk.yellow(key)}`);
          continue;
        }

        const dirPath = path.dirname(filePath);
        fs.mkdirSync(dirPath, { recursive: true });

        const bodyContents = await response.Body.transformToByteArray();
        fs.writeFileSync(filePath, bodyContents);

        pulledCount++;
        logger.success(
          `Pulled: ${chalk.green(key)} → ${chalk.green(localKey)}`,
        );
      } catch (err) {
        logger.error(
          `Failed to pull ${chalk.cyan(key)}: ${chalk.red(String(err))}`,
        );
      }
    }

    logger.info(
      `Files pulled (new/changed): ${chalk.green(pulledCount.toString())}`,
    );
    logger.info(
      `Files skipped (unchanged): ${chalk.yellow(skippedCount.toString())}`,
    );
    logger.success(chalk.bold.green("Pull completed successfully!"));
  } catch (err) {
    logger.error(`Failed to pull: ${chalk.red(String(err))}`);
    throw err;
  }
}

if (require.main === module) {
  pullBucket({
    r2Client,
    bucketName: BUCKET_NAME,
    pullDir: path.resolve(getRootPath(), "cdn"),
    logger,
    ignore: ["changelogs/"],
  }).catch((error: Error) => {
    logger.error(`Unhandled error: ${chalk.red(error.message)}`);
    process.exit(1);
  });
}
