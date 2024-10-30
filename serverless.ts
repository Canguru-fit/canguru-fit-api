/* eslint-disable import/no-unresolved */
import type { AWS } from '@serverless/typescript';
import * as functions from '@functions/index';
import env from './serverless/envs';

const serverlessConfiguration: AWS = {
  service: 'canguru-fit-api',
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
    runtime: 'nodejs18.x',
    versionFunctions: false,
    deploymentBucket: {
      name: 'canguru-fit-serverless-framework',
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
      AWS_COGNITO_PERSONAL_POOL_ID: process.env.AWS_COGNITO_PERSONAL_POOL_ID,
      AWS_COGNITO_PERSONAL_CLIENT_ID: process.env.AWS_COGNITO_PERSONAL_CLIENT_ID,
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['cognito-idp:*'],
        Resource: [
          `arn:aws:cognito-idp:us-east-1:694313933492:userpool/${process.env.AWS_COGNITO_POOL_ID}`,
          `arn:aws:cognito-idp:us-east-1:694313933492:userpool/${process.env.AWS_COGNITO_PERSONAL_POOL_ID}`,
        ],
      },
      /* {
        Effect: 'Allow',
        Action: ['s3:*'],
        Resource: [
          `arn:aws:s3:::eclosing-diligences/*`,
          `arn:aws:s3:::homolog-eclosing-diligences/*`,
          `arn:aws:s3:::dev-eclosing-diligences/*`,
          `arn:aws:s3:::dev-quill-diligence-app-bucket/*`,
          `arn:aws:s3:::eclosing-dumps/*`,
        ],
      }, */
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
      target: 'node18',
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
              UserPoolName: process.env.NODE_ENV !== 'prod' ? `canguru-fit-${process.env.NODE_ENV}` : 'canguru-fit',
              UsernameAttributes: ['email'],
              AutoVerifiedAttributes: ['email'],
              UsernameConfiguration: {
                CaseSensitive: false,
              },
              VerificationMessageTemplate: {
                DefaultEmailOption: 'CONFIRM_WITH_LINK',
                EmailMessageByLink: 'Clique no link abaixo para verificar seu endereço de e-mail. {##Verify Email##} ',
                EmailSubjectByLink: 'Canguru.fit - Confirmação de e-mail',
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
          CognitoIdentityProviderGoogle: {
            Type: 'AWS::Cognito::UserPoolIdentityProvider',
            Properties: {
              AttributeMapping: {
                email: 'email',
                email_verified: 'email_verified',
                given_name: 'given_name',
                family_name: 'family_name',
                username: 'sub',
              },
              ProviderDetails: {
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_SECRET_KEY,
                authorize_scopes: 'email openid profile',
              },
              ProviderName: 'Google',
              ProviderType: 'Google',
              UserPoolId: {
                Ref: 'CognitoUserPool',
              },
            },
          },
          CognitoUserPoolClient: {
            Type: 'AWS::Cognito::UserPoolClient',
            DependsOn: ['CognitoIdentityProviderGoogle'],
            Properties: {
              AccessTokenValidity: 180,
              IdTokenValidity: 180,
              RefreshTokenValidity: 30,
              AllowedOAuthFlows: ['implicit'],
              AllowedOAuthFlowsUserPoolClient: true,
              AllowedOAuthScopes: ['aws.cognito.signin.user.admin', 'email', 'openid', 'profile'],
              CallbackURLs:
                process.env.NODE_ENV !== 'prod'
                  ? ['http://localhost:3000/', 'https://dev-app.canguru.fit', 'https://homolog-app.canguru.fit']
                  : ['https://app.canguru.fit'],
              LogoutURLs:
                process.env.NODE_ENV !== 'prod'
                  ? [
                      'http://localhost:3000/login',
                      'https://dev-app.canguru.fit/login',
                      'https://homolog-app.canguru.fit/login',
                    ]
                  : ['https://app.canguru.fit/login'],
              ClientName: process.env.NODE_ENV !== 'prod' ? `canguru-fit-${process.env.NODE_ENV}` : 'canguru-fit',
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
              SupportedIdentityProviders: ['COGNITO', 'Google'],
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
              Domain: `canguru-fit-${process.env.NODE_ENV}`,
              UserPoolId: {
                Ref: 'CognitoUserPool',
              },
            },
          },
        },
      },
      personal: {
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
              UserPoolName:
                process.env.NODE_ENV !== 'prod'
                  ? `canguru-fit-personal-${process.env.NODE_ENV}`
                  : 'canguru-fit-personal',
              UsernameAttributes: ['email'],
              AutoVerifiedAttributes: ['email'],
              UsernameConfiguration: {
                CaseSensitive: false,
              },
              VerificationMessageTemplate: {
                DefaultEmailOption: 'CONFIRM_WITH_LINK',
                EmailMessageByLink: 'Clique no link abaixo para verificar seu endereço de e-mail.{##Verify Email##} ',
                EmailSubjectByLink: 'Canguru.fit - Confirmação de e-mail',
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
          CognitoIdentityProviderGoogle: {
            Type: 'AWS::Cognito::UserPoolIdentityProvider',
            Properties: {
              AttributeMapping: {
                email: 'email',
                email_verified: 'email_verified',
                given_name: 'given_name',
                family_name: 'family_name',
                username: 'sub',
              },
              ProviderDetails: {
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_SECRET_KEY,
                authorize_scopes: 'email openid profile',
              },
              ProviderName: 'Google',
              ProviderType: 'Google',
              UserPoolId: {
                Ref: 'CognitoUserPool',
              },
            },
          },
          CognitoUserPoolClient: {
            Type: 'AWS::Cognito::UserPoolClient',
            DependsOn: ['CognitoIdentityProviderGoogle'],
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
                      'https://dev-personal.canguru.fit',
                      'https://homolog-personal.canguru.fit',
                    ]
                  : ['https://personal.canguru.fit'],
              LogoutURLs:
                // analisar urls
                process.env.NODE_ENV !== 'prod'
                  ? [
                      'http://localhost:3000/login',
                      'https://dev-personal.canguru.fit/login',
                      'https://homolog-personal.canguru.fit/login',
                    ]
                  : ['https://personal.canguru.fit/login'],
              ClientName:
                process.env.NODE_ENV !== 'prod'
                  ? `canguru-fit-personal-${process.env.NODE_ENV}`
                  : 'canguru-fit-personal',
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
              SupportedIdentityProviders: ['COGNITO', 'Google'],
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
              Domain: `personal-${process.env.NODE_ENV}`,
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
