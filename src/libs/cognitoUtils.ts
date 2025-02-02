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
  AdminCreateUserCommandInput,
  AdminSetUserPasswordCommandInput,
} from '@aws-sdk/client-cognito-identity-provider';
import jwkToPem from 'jwk-to-pem';
import jwt, { JwtPayload } from 'jsonwebtoken';
import Exception from './Exceptions';

const DEFAULT_USER_POOL_ID = process.env.AWS_COGNITO_PERSONAL_POOL_ID;
const DEFAULT_USER_CLIENT_ID = process.env.AWS_COGNITO_PERSONAL_CLIENT_ID;

const PoolIdByClient = (clientId) => {
  if (clientId === process.env.AWS_COGNITO_PERSONAL_CLIENT_ID) return process.env.AWS_COGNITO_PERSONAL_POOL_ID;
  if (clientId === process.env.AWS_COGNITO_CLIENT_ID) return process.env.AWS_COGNITO_POOL_ID;
  return null;
};

const client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });
client.config.credentials();

export const createUser = async (
  email: string,
  name: string,
  UserPoolId: string = DEFAULT_USER_POOL_ID
): Promise<unknown> => {
  const createUserCommandInput: AdminCreateUserCommandInput = {
    UserPoolId,
    Username: email,
    UserAttributes: [
      { Name: 'email', Value: email },
      { Name: 'email_verified', Value: 'true' },
      { Name: 'name', Value: name },
    ],
    DesiredDeliveryMediums: ['EMAIL'],
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
  return response.AuthenticationResult || response.ChallengeName;
};

export const verifyToken = async (authorization): Promise<(JwtPayload & { UserPoolId: string }) | undefined> => {
  const [, token] = authorization?.split(' ') || [];

  if (!token) throw new Exception(Exception.UNAUTHORIZED);

  const decodedJwt = jwt.decode(token, { complete: true }) as { payload: JwtPayload; header: { kid: string } };
  const UserPoolId = PoolIdByClient(decodedJwt.payload.client_id);
  if (!UserPoolId) throw new Exception(Exception.UNAUTHORIZED);

  const response = await fetch(`https://cognito-idp.us-east-1.amazonaws.com/${UserPoolId}/.well-known/jwks.json`).then(
    (res) => res.json()
  );
  if (!response) throw new Error('Error! Unable to download JWKs');

  const jwk = response as { keys: jwkToPem.JWK[] };
  const pem = jwkToPem(jwk.keys[1] as jwkToPem.JWK);

  return new Promise((resolve, reject) => {
    jwt.verify(token, pem, { algorithms: ['RS256'] }, async (err, decoded: JwtPayload | undefined) => {
      if (err) return reject(err);
      return resolve({ ...decoded, UserPoolId });
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
): Promise<AdminLinkProviderForUserCommandOutput> => {
  const command = new AdminLinkProviderForUserCommand({
    UserPoolId,
    DestinationUser: {
      ProviderName: 'Cognito',
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

export const changeFirstPassword = async (
  username,
  oldPassword,
  newPassword,
  ClientId = DEFAULT_USER_CLIENT_ID,
  UserPoolId = DEFAULT_USER_POOL_ID
) => {
  const checkUser = await initiateAuth(
    {
      USERNAME: username,
      PASSWORD: oldPassword,
    },
    ClientId
  );
  if (checkUser !== 'NEW_PASSWORD_REQUIRED') throw new Exception(Exception.UNAUTHORIZED);
  const updatePasswordCommandInput: AdminSetUserPasswordCommandInput = {
    UserPoolId,
    Password: newPassword,
    Username: username,
    Permanent: true,
  };

  const command = new AdminSetUserPasswordCommand(updatePasswordCommandInput);
  const output = await client.send(command);
  if (output.$metadata.httpStatusCode !== 200) {
    throw new Error(`Error changing password`);
  }
  return output;
};
