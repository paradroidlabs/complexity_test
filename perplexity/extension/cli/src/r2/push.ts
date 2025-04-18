import fs from "fs";
import path from "path";
import process from "process";

import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import type { S3Client } from "@aws-sdk/client-s3";
import type { Logger } from "@complexity/cli-logger";
import chalk from "chalk";

import { r2Client, BUCKET_NAME, logger } from "@/r2/config";
import {
  getAllFiles,
  getBucketObjects,
  getContentType,
  removePrefixes,
  type FileInfo,
} from "@/r2/utils";
import { getRootPath } from "@/utils";

type UploadFileParams = {
  client: S3Client;
  bucketName: string;
  fileInfo: FileInfo;
  logger: Logger;
  prefix?: string;
};

async function uploadFile({
  client,
  bucketName,
  fileInfo,
  logger,
  prefix,
}: UploadFileParams): Promise<void> {
  const bucketKey = prefix ? `${prefix}${fileInfo.key}` : fileInfo.key;
  logger.verbose(`Uploading: ${chalk.cyan(bucketKey)}`);

  const fileContent = fs.readFileSync(fileInfo.fullPath);

  const uploadCommand = new PutObjectCommand({
    Bucket: bucketName,
    Key: bucketKey,
    Body: fileContent,
    ContentType: getContentType({ fileName: fileInfo.key }),
  });

  await client.send(uploadCommand);
  logger.success(`Uploaded: ${chalk.green(bucketKey)}`);
}

type DeleteFileParams = {
  client: S3Client;
  bucketName: string;
  key: string;
  logger: Logger;
};

async function deleteFile({
  client,
  bucketName,
  key,
  logger,
}: DeleteFileParams): Promise<void> {
  logger.verbose(`Deleting: ${chalk.yellow(key)}`);

  const deleteCommand = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  await client.send(deleteCommand);
  logger.success(`Deleted: ${chalk.red(key)}`);
}

type SyncWithBucketParams = {
  client: S3Client;
  bucketName: string;
  localDir?: string;
  logger: Logger;
  prefix?: string;
  ignore?: string[];
};

export async function syncWithBucket({
  client,
  bucketName,
  localDir,
  logger,
  prefix,
  ignore = [],
}: SyncWithBucketParams): Promise<void> {
  if (!localDir) {
    logger.error("localDir is not set. Aborting sync.");
    process.exit(1);
  }

  try {
    if (!fs.existsSync(localDir)) {
      logger.error(
        `Directory ${chalk.red(localDir)} does not exist. Aborting sync.`,
      );
      return;
    }

    logger.info(
      `Starting sync from ${chalk.blue(localDir)} to bucket ${chalk.blue(bucketName)}...`,
    );

    if (ignore.length > 0) {
      logger.info(`Ignoring prefixes: ${chalk.yellow(ignore.join(", "))}`);
    }

    const allLocalFiles = getAllFiles({ dir: localDir });

    // Filter out local files that match ignored prefixes
    const localFiles = allLocalFiles.filter((file) => {
      return !ignore.some((ignorePrefix) => file.key.startsWith(ignorePrefix));
    });

    logger.info(
      `Found ${chalk.blue(allLocalFiles.length.toString())} local files, using ${chalk.blue(localFiles.length.toString())} after filtering`,
    );

    const localFileMap: Record<string, FileInfo> = {};
    for (const file of localFiles) {
      localFileMap[file.key] = file;
    }

    const bucketObjects = await getBucketObjects({
      client,
      bucketName,
      prefix,
      ignore,
    });
    const bucketKeys = Object.keys(bucketObjects);
    logger.info(
      `Found ${chalk.blue(bucketKeys.length.toString())} objects in bucket`,
    );

    const filesToUpdate: FileInfo[] = [];
    const filesToUpload: FileInfo[] = [];

    for (const file of localFiles) {
      const bucketKey = prefix ? `${prefix}${file.key}` : file.key;
      if (bucketObjects[bucketKey]) {
        if (bucketObjects[bucketKey] !== file.hash) {
          filesToUpdate.push(file);
        }
      } else {
        filesToUpload.push(file);
      }
    }

    const keysToDelete = bucketKeys.filter((key) => {
      // Remove all prefixes that should be ignored when checking local files
      const prefixesToRemove = [prefix]
        .concat(ignore)
        .filter(Boolean) as string[];
      const localKey = removePrefixes({ key, prefixes: prefixesToRemove });
      return !localFileMap[localKey];
    });

    logger.info(
      `Files to update (changed): ${chalk.yellow(filesToUpdate.length.toString())}`,
    );
    logger.info(
      `Files to upload (new): ${chalk.green(filesToUpload.length.toString())}`,
    );
    logger.info(
      `Files to delete (removed): ${chalk.red(keysToDelete.length.toString())}`,
    );

    for (const file of filesToUpload) {
      try {
        await uploadFile({
          client,
          bucketName,
          fileInfo: file,
          logger,
          prefix,
        });
      } catch (err) {
        logger.error(
          `Failed to upload new file ${chalk.cyan(file.key)}: ${chalk.red(String(err))}`,
        );
      }
    }

    for (const file of filesToUpdate) {
      try {
        await uploadFile({
          client,
          bucketName,
          fileInfo: file,
          logger,
          prefix,
        });
      } catch (err) {
        logger.error(
          `Failed to update changed file ${chalk.yellow(file.key)}: ${chalk.red(String(err))}`,
        );
      }
    }

    for (const key of keysToDelete) {
      try {
        await deleteFile({
          client,
          bucketName,
          key,
          logger,
        });
      } catch (err) {
        logger.error(
          `Failed to delete ${chalk.red(key)}: ${chalk.red(String(err))}`,
        );
      }
    }

    logger.success(chalk.bold.green("Sync completed successfully!"));
  } catch (err) {
    logger.error(`Sync failed: ${chalk.red(String(err))}`);
    throw err;
  }
}

if (require.main === module) {
  syncWithBucket({
    client: r2Client,
    bucketName: BUCKET_NAME,
    localDir: path.resolve(getRootPath(), "cdn"),
    logger,
    ignore: ["changelogs/"],
  }).catch((error: Error) => {
    logger.error(`Unhandled error: ${error.message}`);
    process.exit(1);
  });
}
