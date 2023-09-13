/* eslint-disable import/no-unresolved */
import type { AWS } from '@serverless/typescript';

import * as functions from '@functions/index';
import env from './serverless/envs';

const serverlessConfiguration: AWS = {
  service: 'eclosing-api',
  frameworkVersion: '3',
  plugins: [
    'serverless-esbuild',
    'serverless-offline',
    'serverless-domain-manager',
    'serverless-express',
    'serverless-deployment-bucket',
    'serverless-apigw-binary',
    'serverless-dotenv-plugin',
  ],
  console: true,
  useDotenv: true,
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    versionFunctions: false,
    deploymentBucket: {
      name: 'quill-serverless-framework',
    },
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    tracing: {
      apiGateway: true,
      lambda: true,
    },
    timeout: 30,
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      NODE_ENV: process.env.NODE_ENV,
      MONGODB_URL: process.env.MONGODB_URL,
      BUCKET_NAME: process.env.BUCKET_NAME,
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['s3:*'],
        Resource: [
          `arn:aws:s3:::eclosing-diligences/*`,
          `arn:aws:s3:::homolog-eclosing-diligences/*`,
          `arn:aws:s3:::dev-eclosing-diligences/*`,
          `arn:aws:s3:::dev-quill-diligence-app-bucket/*`,
        ],
      },
    ],
  },
  // import the function via paths
  functions,
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node16',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    customDomain: {
      domainName: env[process.env.NODE_ENV || 'dev'].domain,
      stage: process.env.NODE_ENV,
      basePath: 'v1',
      createRoute53Record: true,
    },
    apigwBinary: {
      types: ['*/*'],
    },
  },
};
module.exports = serverlessConfiguration;
