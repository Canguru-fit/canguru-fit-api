import {
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  AdminDisableUserCommand,
  AdminEnableUserCommand,
  AdminGetUserCommand,
  AdminSetUserPasswordCommand,
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  AuthFlowType,
  SignUpCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  ConfirmSignUpCommand,
  ResendConfirmationCodeCommand,
  AdminLinkProviderForUserCommand,
  ChangePasswordCommand,
  AdminLinkProviderForUserCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider';
import jwt, { JwtPayload } from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import Exception from './Exceptions';

const DEFAULT_USER_POOL_ID = process.env.AWS_COGNITO_PERSONAL_POOL_ID;
const DEFAULT_USER_CLIENT_ID = process.env.AWS_COGNITO_PERSONAL_CLIENT_ID;

const client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });
client.config.credentials();

export const createUser = async (Username: string, UserPoolId: string = DEFAULT_USER_POOL_ID): Promise<unknown> => {
  const createUserCommandInput = {
    UserPoolId,
    Username,
    UserAttributes: [
      { Name: 'email', Value: Username },
      { Name: 'email_verified', Value: 'true' },
    ],
  };

  const command = new AdminCreateUserCommand(createUserCommandInput);
  return client.send(command);
};

export const signUpUser = async (
  email: string,
  Password: string,
  name: string,
  ClientId: string = DEFAULT_USER_CLIENT_ID
): Promise<unknown> => {
  const SignUpCommandInput = {
    ClientId,
    Username: email,
    Password,
    UserAttributes: [
      {
        Name: 'email',
        Value: email,
      },
      {
        Name: 'name',
        Value: name,
      },
    ],
  };

  const command = new SignUpCommand(SignUpCommandInput);
  return client.send(command);
};

export const confirmSignup = async (Username, ConfirmationCode, ClientId = DEFAULT_USER_CLIENT_ID) => {
  const command = new ConfirmSignUpCommand({ ClientId, Username, ConfirmationCode, ForceAliasCreation: true });
  return client.send(command);
};

export const getUser = async (Username: string, UserPoolId: string = DEFAULT_USER_POOL_ID): Promise<unknown> => {
  const command = new AdminGetUserCommand({
    UserPoolId,
    Username,
  });
  return client.send(command);
};

export const deleteUser = async (Username: string, UserPoolId: string = DEFAULT_USER_POOL_ID): Promise<unknown> => {
  const command = new AdminDeleteUserCommand({
    UserPoolId,
    Username,
  });
  return client.send(command);
};

export const toggleUserStatus = async (
  Username: string,
  condition: boolean,
  UserPoolId: string = DEFAULT_USER_POOL_ID
): Promise<unknown> => {
  const commandInput = {
    UserPoolId,
    Username,
  };
  const command = condition ? new AdminEnableUserCommand(commandInput) : new AdminDisableUserCommand(commandInput);
  return client.send(command);
};

export const resendTempPassword = async (
  Username: string,
  UserPoolId: string = DEFAULT_USER_POOL_ID
): Promise<unknown> => {
  const command = new AdminCreateUserCommand({
    UserPoolId,
    Username,
    MessageAction: 'RESEND',
  });
  return client.send(command);
};

export const resetPassword = async (
  Username: string,
  Password: string,
  UserPoolId: string = DEFAULT_USER_POOL_ID
): Promise<unknown> => {
  const command = new AdminSetUserPasswordCommand({
    UserPoolId,
    Username,
    Password,
    Permanent: true,
  });
  return client.send(command);
};

export const initiateAuth = async (
  AuthParameters,
  ClientId = DEFAULT_USER_CLIENT_ID,
  AuthFlow: AuthFlowType = AuthFlowType.USER_PASSWORD_AUTH
) => {
  const command = new InitiateAuthCommand({
    AuthFlow,
    AuthParameters,
    ClientId,
  });

  const response = await client.send(command);
  return response.AuthenticationResult;
};

export const verifyToken = async (authorization, UserPoolId = DEFAULT_USER_POOL_ID) => {
  const jwkClient = jwksClient({
    jwksUri: `https://cognito-idp.us-east-1.amazonaws.com/${UserPoolId}/.well-known/jwks.json`,
  });

  const getKey = (header: jwt.JwtHeader, callback: jwt.SigningKeyCallback): void => {
    jwkClient.getSigningKey(header.kid, (err, key) => {
      if (err) {
        callback(err, null);
        return;
      }
      const signingKey = key.getPublicKey();
      callback(null, signingKey);
    });
  };

  const token = authorization?.split(' ')?.[1] || '';

  if (!token) throw new Exception(Exception.UNAUTHORIZED);

  return new Promise((resolve, reject) => {
    jwt.verify(token, getKey, { algorithms: ['RS256'] }, async (err, decoded: JwtPayload | undefined) => {
      if (err) return reject(err);
      return resolve(decoded);
    });
  });
};

export const forgotPassword = async (Username: string, ClientId = DEFAULT_USER_CLIENT_ID): Promise<unknown> => {
  const command = new ForgotPasswordCommand({
    ClientId,
    Username,
  });
  return client.send(command);
};

export const confirmForgotPassword = async (
  code: string,
  username: string,
  newPassword: string,
  ClientId = DEFAULT_USER_CLIENT_ID
): Promise<unknown> => {
  const command = new ConfirmForgotPasswordCommand({
    ClientId,
    ConfirmationCode: code,
    Password: newPassword,
    Username: username,
  });
  return client.send(command);
};

export const changePassword = async (
  PreviousPassword: string,
  ProposedPassword: string,
  AccessToken: string
): Promise<unknown> => {
  const command = new ChangePasswordCommand({
    PreviousPassword,
    ProposedPassword,
    AccessToken,
  });
  return client.send(command);
};

export const resendConfirmation = async (Username: string, ClientId = DEFAULT_USER_CLIENT_ID) => {
  const command = new ResendConfirmationCodeCommand({ ClientId, Username });
  return client.send(command);
};

export const linkProviderUser = async (
  Username: string,
  ProviderValue: string,
  UserPoolId: string = DEFAULT_USER_POOL_ID,
  ProviderName: string = 'Google'
  detinationProviderName: string = 'Cognito'
): Promise<AdminLinkProviderForUserCommandOutput> => {
  const command = new AdminLinkProviderForUserCommand({
    UserPoolId,
    DestinationUser: {
      ProviderName: detinationProviderName,
      ProviderAttributeValue: Username,
    },
    SourceUser: {
      ProviderName,
      ProviderAttributeName: 'Cognito_Subject',
      ProviderAttributeValue: ProviderValue,
    },
  });
  return client.send(command);
};
