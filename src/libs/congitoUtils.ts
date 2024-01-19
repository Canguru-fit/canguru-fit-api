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
} from '@aws-sdk/client-cognito-identity-provider';
import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import axios from 'axios';

const DEFAULT_USER_POOL_ID = process.env.AWS_COGNITO_POOL_ID;
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

export const initiateAuth = async ({ username, password }) => {
  const command = new InitiateAuthCommand({
    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
    ClientId: process.env.AWS_COGNITO_CLIENT_ID,
  });

  try {
    const client = new CognitoIdentityProviderClient({
      region: process.env.AWS_REGION,
    });
    client.config.credentials();
    const response = await client.send(command);
    return response.AuthenticationResult;
  } catch (error) {
    throw new Error(error);
  }
};

export const verifyToken = async (req: Request) => {
  try {
    const data = await axios.get(
      `https://cognito-idp.us-east-1.amazonaws.com/${process.env.AWS_COGNITO_POOL_ID}/.well-known/jwks.json`
    );

    const authorization = req.headers?.authorization as string;

    if (!authorization) {
      throw new Error('Missing token.');
    }

    const token = authorization.split(' ')[1];

    const pem = jwkToPem(JSON.parse(data.data));

    const auth = jwt.verify(token, pem, { algorithms: ['RS256'] });

    return auth;
  } catch (error) {
    return error;
  }
};
