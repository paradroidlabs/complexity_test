import crypto from "crypto";
import fs from "fs";
import path from "path";

import { ListObjectsCommand } from "@aws-sdk/client-s3";
import type { S3Client } from "@aws-sdk/client-s3";
import type { Logger } from "@complexity/cli-logger";
import chalk from "chalk";
import mime from "mime-types";

export type FileInfo = {
  key: string;
  fullPath: string;
  hash: string;
  size: number;
};

type CalculateFileHashParams = {
  filePath: string;
};

export function calculateFileHash({
  filePath,
}: CalculateFileHashParams): string {
  if (!fs.existsSync(filePath)) return "";
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash("md5");
  hashSum.update(fileBuffer);
  return hashSum.digest("hex");
}

type GetAllFilesParams = {
  dir: string;
  baseDir?: string;
};

export function getAllFiles({
  dir,
  baseDir = dir,
}: GetAllFilesParams): FileInfo[] {
  const files: FileInfo[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...getAllFiles({ dir: fullPath, baseDir }));
    } else {
      const stats = fs.statSync(fullPath);
      const key = path.relative(baseDir, fullPath).replace(/\\/g, "/");
      const hash = calculateFileHash({ filePath: fullPath });

      files.push({
        key,
        fullPath,
        hash,
        size: stats.size,
      });
    }
  }

  return files;
}

type GetBucketObjectsParams = {
  client: S3Client;
  bucketName: string;
  prefix?: string;
  ignore?: string[];
};

export async function getBucketObjects({
  client,
  bucketName,
  prefix,
  ignore = [],
}: GetBucketObjectsParams): Promise<Record<string, string>> {
  const objectMap: Record<string, string> = {};
  const listCommand = new ListObjectsCommand({
    Bucket: bucketName,
    Prefix: prefix,
  });

  const response = await client.send(listCommand);

  if (!response.Contents) {
    return objectMap;
  }

  for (const object of response.Contents) {
    if (object.Key && object.ETag) {
      // Skip if the key matches any of the ignored prefixes
      if (ignore.some((ignorePrefix) => object.Key!.startsWith(ignorePrefix))) {
        continue;
      }

      // ETag comes with quotes, remove them
      objectMap[object.Key] = object.ETag.replace(/^"(.*)"$/, "$1");
    }
  }

  return objectMap;
}

type GetContentTypeParams = {
  fileName: string;
};

export function getContentType({ fileName }: GetContentTypeParams): string {
  if (path.extname(fileName) === "") {
    return "text/plain";
  }

  const mimeType = mime.lookup(fileName);

  if (mimeType === false) {
    return "application/octet-stream";
  }

  return mimeType;
}

type EnsureDirectoryExistsParams = {
  dir: string;
  logger: Logger;
};

export function ensureDirectoryExists({
  dir,
  logger,
}: EnsureDirectoryExistsParams): boolean {
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
      logger.info(`Created directory ${chalk.blue(dir)}`);
      return true;
    } catch (err) {
      logger.error(`Failed to create directory: ${chalk.red(String(err))}`);
      return false;
    }
  }
  return true;
}

type RemovePrefixesParams = {
  key: string;
  prefixes: string[];
};

export function removePrefixes({
  key,
  prefixes,
}: RemovePrefixesParams): string {
  let result = key;
  for (const prefix of prefixes) {
    if (prefix && result.startsWith(prefix)) {
      result = result.replace(new RegExp(`^${prefix}`), "");
    }
  }
  return result;
}
