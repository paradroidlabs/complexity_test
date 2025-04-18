import process from "process";

import { S3Client } from "@aws-sdk/client-s3";
import { Logger } from "@complexity/cli-logger";

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

export const BUCKET_NAME = process.env.R2_BUCKET_NAME || "my-bucket";

export const logger = new Logger({
  name: "pplx-ext-release-cli",
  printPrefix: false,
});
