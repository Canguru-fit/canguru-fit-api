/* eslint-disable import/no-extraneous-dependencies */
import { S3Client, CopyObjectCommand, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Upload } from '@aws-sdk/lib-storage';
import axios from 'axios';
import fs from 'node:fs';

const client = new S3Client({ region: process.env.AWS_REGION });

const s3Bucket = process.env.BUCKET_NAME;

export const s3CopyObjectCommand = async (CopySource: string, Name: string, Bucket: string = s3Bucket) => {
  const ext = CopySource.split('.').pop();
  const Key = `${Name}.${ext}`;
  const ContentType = ext === 'pdf' ? 'application/pdf' : `image/${ext}`;

  const command = new CopyObjectCommand({
    CopySource,
    Bucket,
    Key,
    ContentType,
    ContentDisposition: 'inline',
  });

  try {
    await client.send(command);
    return Key;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const s3StreamObjectCommand = async (data: string, Key: string, Bucket: string = s3Bucket) => {
  try {
    const documentName = Key.split('/').pop() || 'unknown';

    if (!fs.existsSync('/tmp')) {
      fs.mkdirSync('/tmp');
    }

    fs.writeFileSync(`/tmp/${documentName}`, data, 'base64');

    const Body = fs.createReadStream(`/tmp/${documentName}`);

    const parallelUploads3 = new Upload({
      client,
      params: { Bucket, Key, Body, ContentType: 'application/pdf' },
    });

    await parallelUploads3.done();
    return Key;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const uploadFileToS3 = async (url: string, s3Path: string, Bucket: string = s3Bucket): Promise<string> => {
  const s3 = new S3Client({
    region: process.env.AWS_REGION,
  });
  s3.config.credentials();
  const fileContent = await axios.get(url, {
    responseType: 'arraybuffer',
    headers: { Accept: 'application/pdf', 'Content-Type': 'UTF-8' },
  });

  const params = {
    Bucket,
    Key: s3Path,
    Body: fileContent.data,
    ContentType: 'application/pdf',
  };

  const command = new PutObjectCommand(params);

  const data = await s3.send(command);
  console.log(data);
  return s3Path;
};

export const s3GetSignedUrl = async (Key: string, Bucket: string = s3Bucket) => {
  const ext = Key.split('.').pop();
  const ResponseContentType = ext === 'pdf' ? 'application/pdf' : `image/${ext}`;
  const getObjectParams = {
    Bucket,
    Key,
    ResponseContentType,
  };
  const command = new GetObjectCommand(getObjectParams);
  return getSignedUrl(client, command, { expiresIn: 3600 });
};

export const s3GetSignedUrlPdf = async (Key: string, Bucket: string = s3Bucket) => {
  const ResponseContentType = 'application/pdf';
  const getObjectParams = {
    Bucket,
    Key,
    ResponseContentType,
  };
  const command = new GetObjectCommand(getObjectParams);
  return getSignedUrl(client, command, { expiresIn: 3600 });
};
