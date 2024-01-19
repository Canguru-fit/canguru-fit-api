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
    'serverless-plugin-additional-stacks',
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
      AWS_COGNITO_POOL_ID: process.env.AWS_COGNITO_POOL_ID,
      AWS_COGNITO_CLIENT_ID: process.env.AWS_COGNITO_CLIENT_ID,
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['cognito-idp:*'],
        Resource: `arn:aws:cognito-idp:us-east-1:283911962114:userpool/${process.env.AWS_COGNITO_POOL_ID}`,
      },
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
    additionalStacks: {
      cognito: {
        Resources: {
          CognitoUserPool: {
            Type: 'AWS::Cognito::UserPool',
            Properties: {
              AccountRecoverySetting: {
                RecoveryMechanisms: [
                  {
                    Name: 'verified_email',
                    Priority: 1,
                  },
                ],
              },
              UserPoolName: process.env.NODE_ENV !== 'prod' ? `quill-${process.env.NODE_ENV}` : 'quill',
              UsernameAttributes: ['email'],
              AutoVerifiedAttributes: ['email'],
              UsernameConfiguration: {
                CaseSensitive: false,
              },
              VerificationMessageTemplate: {
                DefaultEmailOption: 'CONFIRM_WITH_LINK',
                EmailMessageByLink: 'Clique no link abaixo para verificar seu endereço de e-mail. {##Verify Email##} ',
                EmailSubjectByLink: 'Quill - confirmação de e-mail',
              },
              Schema: [
                {
                  AttributeDataType: 'String',
                  Mutable: true,
                  Name: 'email',
                  Required: true,
                },
              ],
              Policies: {
                PasswordPolicy: {
                  MinimumLength: 6,
                  RequireLowercase: false,
                  RequireNumbers: false,
                  RequireSymbols: false,
                  RequireUppercase: false,
                  TemporaryPasswordValidityDays: 7,
                },
              },
            },
          },
          CognitoUserPoolClient: {
            Type: 'AWS::Cognito::UserPoolClient',
            // DependsOn: ['CognitoIdentityProviderGoogle', 'CognitoIdentityProviderFacebook'],
            DependsOn: [],
            Properties: {
              AccessTokenValidity: 180,
              IdTokenValidity: 180,
              RefreshTokenValidity: 30,
              AllowedOAuthFlows: ['implicit'],
              AllowedOAuthFlowsUserPoolClient: true,
              AllowedOAuthScopes: ['aws.cognito.signin.user.admin', 'email', 'openid', 'profile'],
              CallbackURLs:
                process.env.NODE_ENV !== 'prod'
                  ? ['http://localhost:3000/', 'https://dev.quill.com.br', 'https://homolog.quill.com.br']
                  : ['https://quill.com.br'],
              LogoutURLs:
                process.env.NODE_ENV !== 'prod'
                  ? [
                      'http://localhost:3000/login',
                      'https://dev.quill.com.br/login',
                      'https://homolog.quill.com.br/login',
                    ]
                  : ['https://quill.com.br/login'],
              ClientName: process.env.NODE_ENV !== 'prod' ? `quill-${process.env.NODE_ENV}` : 'quill',
              PreventUserExistenceErrors: 'LEGACY',
              UserPoolId: {
                Ref: 'CognitoUserPool',
              },
              ExplicitAuthFlows: [
                'ALLOW_USER_PASSWORD_AUTH',
                'ALLOW_REFRESH_TOKEN_AUTH',
                'ALLOW_USER_SRP_AUTH',
                'ALLOW_ADMIN_USER_PASSWORD_AUTH',
              ],
              GenerateSecret: false,
              // SupportedIdentityProviders: ['COGNITO', 'Facebook', 'Google'],
              SupportedIdentityProviders: ['COGNITO'],
              TokenValidityUnits: {
                AccessToken: 'minutes',
                IdToken: 'minutes',
                RefreshToken: 'days',
              },
            },
          },
          CognitoUserPoolDomain: {
            Type: 'AWS::Cognito::UserPoolDomain',
            Properties: {
              Domain: `quill-${process.env.NODE_ENV}`,
              UserPoolId: {
                Ref: 'CognitoUserPool',
              },
            },
          },
        },
      },
      backoffice: {
        Resources: {
          CognitoUserPool: {
            Type: 'AWS::Cognito::UserPool',
            Properties: {
              AccountRecoverySetting: {
                RecoveryMechanisms: [
                  {
                    Name: 'verified_email',
                    Priority: 1,
                  },
                ],
              },
              UserPoolName: process.env.NODE_ENV !== 'prod' ? `backoffice-${process.env.NODE_ENV}` : 'backoffice',
              UsernameAttributes: ['email'],
              AutoVerifiedAttributes: ['email'],
              UsernameConfiguration: {
                CaseSensitive: false,
              },
              VerificationMessageTemplate: {
                DefaultEmailOption: 'CONFIRM_WITH_LINK',
                EmailMessageByLink: 'Clique no link abaixo para verificar seu endereço de e-mail.{##Verify Email##} ',
                EmailSubjectByLink: 'Quill - confirmação de e-mail',
              },
              Schema: [
                {
                  AttributeDataType: 'String',
                  Mutable: true,
                  Name: 'email',
                  Required: true,
                },
              ],
              Policies: {
                PasswordPolicy: {
                  MinimumLength: 6,
                  RequireLowercase: false,
                  RequireNumbers: false,
                  RequireSymbols: false,
                  RequireUppercase: false,
                  TemporaryPasswordValidityDays: 7,
                },
              },
            },
          },
          CognitoUserPoolClient: {
            Type: 'AWS::Cognito::UserPoolClient',

            Properties: {
              AccessTokenValidity: 180,
              IdTokenValidity: 180,
              RefreshTokenValidity: 30,
              AllowedOAuthFlows: ['implicit'],
              AllowedOAuthFlowsUserPoolClient: true,
              AllowedOAuthScopes: ['aws.cognito.signin.user.admin', 'email', 'openid', 'profile'],
              CallbackURLs:
                // analisar urls
                process.env.NODE_ENV !== 'prod'
                  ? [
                      'http://localhost:3000/',
                      'https://dev-backoffice.quill.com.br',
                      'https://homolog-backoffice.quill.com.br',
                    ]
                  : ['https://backoffice.quill.com.br'],
              LogoutURLs:
                // analisar urls
                process.env.NODE_ENV !== 'prod'
                  ? [
                      'http://localhost:3000/login',
                      'https://dev-backoffice.quill.com.br/login',
                      'https://homolog-backoffice.quill.com.br/login',
                    ]
                  : ['https://backoffice.quill.com.br/login'],
              ClientName: process.env.NODE_ENV !== 'prod' ? `backoffice-${process.env.NODE_ENV}` : 'backoffice',
              PreventUserExistenceErrors: 'LEGACY',
              UserPoolId: {
                Ref: 'CognitoUserPool',
              },
              ExplicitAuthFlows: [
                'ALLOW_USER_PASSWORD_AUTH',
                'ALLOW_REFRESH_TOKEN_AUTH',
                'ALLOW_USER_SRP_AUTH',
                'ALLOW_ADMIN_USER_PASSWORD_AUTH',
              ],
              GenerateSecret: false,
              SupportedIdentityProviders: ['COGNITO'],
              TokenValidityUnits: {
                AccessToken: 'minutes',
                IdToken: 'minutes',
                RefreshToken: 'days',
              },
            },
          },
          CognitoUserPoolDomain: {
            Type: 'AWS::Cognito::UserPoolDomain',
            Properties: {
              Domain: `backoffice-${process.env.NODE_ENV}`,
              UserPoolId: {
                Ref: 'CognitoUserPool',
              },
            },
          },
        },
      },
    },
  },
};
module.exports = serverlessConfiguration;
