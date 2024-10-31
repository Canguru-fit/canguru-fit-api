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
} from '@aws-sdk/client-cognito-identity-provider';
import jwt, { JwtPayload } from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import jwkToPem from 'jwk-to-pem';
import axios from 'axios';
import Exception from './Exceptions';

const DEFAULT_USER_POOL_ID = process.env.AWS_COGNITO_PERSONAL_POOL_ID;
const DEFAULT_USER_CLIENT_ID = process.env.AWS_COGNITO_PERSONAL_CLIENT_ID;

const client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });
client.config.credentials();

export const createUser = async (Username: string, UserPoolId: string = DEFAULT_USER_POOL_ID): Promise<unknown> => {
  try {
    const createUserCommandInput = {
      UserPoolId,
      Username,
      UserAttributes: [
        {
          Name: 'email',
          Value: Username,
        },
        {
          Name: 'email_verified',
          Value: 'true',
        },
      ],
    };

    const command = new AdminCreateUserCommand(createUserCommandInput);
    return await client.send(command);
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};

export const signUpUser = async (
  Username: string,
  Password: string,
  ClientId: string = DEFAULT_USER_CLIENT_ID
): Promise<unknown> => {
  const SignUpCommandInput = {
    ClientId,
    Username,
    Password,
    UserAttributes: [
      {
        Name: 'email',
        Value: Username,
      },
    ],
  };

  const command = new SignUpCommand(SignUpCommandInput);
  return client.send(command);
};

export const getUser = async (Username: string, UserPoolId: string = DEFAULT_USER_POOL_ID): Promise<unknown> => {
  try {
    const commandInput = {
      UserPoolId,
      Username,
    };

    const command = new AdminGetUserCommand(commandInput);
    return await client.send(command);
  } catch (error) {
    throw new Error(`Error reading user: ${error.message}`);
  }
};

export const deleteUser = async (Username: string, UserPoolId: string = DEFAULT_USER_POOL_ID): Promise<unknown> => {
  try {
    const commandInput = {
      UserPoolId,
      Username,
    };

    const command = new AdminDeleteUserCommand(commandInput);
    return await client.send(command);
  } catch (error) {
    throw new Error(`Error deleting user: ${error.message}`);
  }
};

export const toggleUserStatus = async (
  Username: string,
  condition: boolean,
  UserPoolId: string = DEFAULT_USER_POOL_ID
): Promise<unknown> => {
  try {
    const commandInput = {
      UserPoolId,
      Username,
    };
    const command = condition ? new AdminEnableUserCommand(commandInput) : new AdminDisableUserCommand(commandInput);
    return await client.send(command);
  } catch (error) {
    throw new Error(`Error enabling/disabling user: ${error.message}`);
  }
};

export const resendTempPassword = async (
  Username: string,
  UserPoolId: string = DEFAULT_USER_POOL_ID
): Promise<unknown> => {
  try {
    const commandInput = {
      UserPoolId,
      Username,
      MessageAction: 'RESEND',
    };

    const command = new AdminCreateUserCommand(commandInput);
    return await client.send(command);
  } catch (error) {
    throw new Error(`Error while resending user password: ${error}`);
  }
};

export const resetPassword = async (
  Username: string,
  Password: string,
  UserPoolId: string = DEFAULT_USER_POOL_ID
): Promise<unknown> => {
  try {
    const input = {
      UserPoolId,
      Username,
      Password,
      Permanent: true,
    };

    const command = new AdminSetUserPasswordCommand(input);
    return await client.send(command);
  } catch (error) {
    throw new Error(`Error while reseting user password: ${error}`);
  }
};

export const initiateAuth = async (
  AuthParameters,
  ClientId = DEFAULT_USER_CLIENT_ID,
  AuthFlow: AuthFlowType = AuthFlowType.USER_PASSWORD_AUTH
) => {
  console.log(JSON.stringify(AuthParameters));
  const command = new InitiateAuthCommand({
    AuthFlow,
    AuthParameters,
    ClientId,
  });

  try {
    const response = await client.send(command);
    return response.AuthenticationResult;
  } catch (error) {
    throw new Error(error);
  }
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
  try {
    const forgotPasswordCommandInput = {
      ClientId,
      Username,
    };

    const command = new ForgotPasswordCommand(forgotPasswordCommandInput);
    return await client.send(command);
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};

export const updatePassword = async (
  code: string,
  username: string,
  newPassword: string,
  ClientId = DEFAULT_USER_CLIENT_ID
): Promise<unknown> => {
  try {
    const updatePasswordCommandInput = {
      ClientId,
      ConfirmationCode: code,
      Password: newPassword,
      Username: username,
    };

    const command = new ConfirmForgotPasswordCommand(updatePasswordCommandInput);
    return await client.send(command);
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};
