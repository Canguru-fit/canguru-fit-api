/* eslint-disable import/no-extraneous-dependencies */
import { S3Client, CopyObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const client = new S3Client({ region: process.env.AWS_REGION });

const s3Bucket = process.env.BUCKET_NAME;

export const s3CopyObjectCommand = async (CopySource: string, Key: string, Bucket: string = s3Bucket) => {
  const command = new CopyObjectCommand({
    CopySource,
    Bucket,
    Key,
  });

  try {
    await client.send(command);
    return Key;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const s3GetSignedUrl = async (Key: string, Bucket: string = s3Bucket) => {
  const getObjectParams = {
    Bucket,
    Key,
  };
  const command = new GetObjectCommand(getObjectParams);
  return getSignedUrl(client, command, { expiresIn: 3600 });
};
