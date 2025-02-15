import * as cognitoUtils from '@libs/cognitoUtils';
import Exception from '@libs/Exceptions';
import { personalsModel, studentsModel } from '@schemas/index';

export type ISource = 'personal' | 'student';

type IUser = {
  email: string;
  name: string;
  password: string;
  code: string;
  previousPassword: string;
  newPassword: string;
  token: string;
  refreshToken: string;
};

const cognito = {
  personal: {
    UserPoolId: process.env.AWS_COGNITO_PERSONAL_POOL_ID,
    ClientId: process.env.AWS_COGNITO_PERSONAL_CLIENT_ID,
    database: personalsModel,
  },
  student: {
    UserPoolId: process.env.AWS_COGNITO_POOL_ID,
    ClientId: process.env.AWS_COGNITO_CLIENT_ID,
    database: studentsModel,
  },
};

export const signUp = async (source: ISource, body: Partial<IUser>) => {
  const { email, password, name } = body;
  const { ClientId, database } = cognito[source];
  try {
    const foundUser = await database.findOne({ email });
    if (foundUser) {
      if (foundUser?.cognitoId?.includes('google')) throw new Exception(Exception.USER_FROM_EXTERNAL_PROVIDER);
      throw new Exception(Exception.USER_ALREADY_EXIST);
    }
    return cognitoUtils.signUpUser(email?.toLowerCase(), password, name, ClientId);
  } catch (error) {
    if (error.name === 'UsernameExistsException') throw new Exception(Exception.USER_ALREADY_EXIST);
    throw error;
  }
};

export const confirmSignUp = async (source: ISource, body: Partial<IUser>) => {
  const { email, code } = body;
  return cognitoUtils.confirmSignup(email, code, cognito[source].ClientId);
};

export const forgotPassword = async (source: ISource, body: Partial<IUser>) => {
  const { email } = body;
  return cognitoUtils.forgotPassword(email, cognito[source].ClientId);
};

export const confirmForgotPassword = async (source: ISource, body: Partial<IUser>) => {
  const { code, email, password } = body;
  return cognitoUtils.confirmForgotPassword(code, email, password, cognito[source].ClientId);
};

export const changePassword = async (source: ISource, authorization, body: Partial<IUser>) => {
  const { previousPassword, newPassword, email } = body;
  if (source === 'student' && !authorization) {
    return cognitoUtils.changeFirstPassword(
      email,
      previousPassword,
      newPassword,
      process.env.AWS_COGNITO_CLIENT_ID,
      process.env.AWS_COGNITO_POOL_ID
    );
  }
  return cognitoUtils.changePassword(previousPassword, newPassword, authorization.split(' ')[1]);
};

export const resendConfirmation = async (source: ISource, body: Partial<IUser>) => {
  const { email } = body;
  return cognitoUtils.resendConfirmation(email, cognito[source].ClientId);
};

export const login = async (source: ISource, body: { email: string; password: string }) => {
  const { ClientId, database } = cognito[source];
  const { email, password } = body;

  const cognitoAuth = await cognitoUtils.initiateAuth(
    {
      USERNAME: email,
      PASSWORD: password,
    },
    ClientId
  );
  if (cognitoAuth instanceof Object) {
    const user = await database.findOne({ email });
    return { ...cognitoAuth, ...user.toObject() };
  }
  return { code: cognitoAuth };
};

export const validateToken = (authorization: string) => {
  return cognitoUtils.verifyToken(authorization).catch((error) => {
    console.log(error);
    throw new Exception(Exception.UNAUTHORIZED);
  });
};

export const refreshToken = async (source: ISource, body: Partial<IUser>) => {
  const { ClientId, database } = cognito[source];
  const { refreshToken, email } = body;

  const cognitoAuth = await cognitoUtils.initiateAuth({ REFRESH_TOKEN: refreshToken }, ClientId, 'REFRESH_TOKEN');
  if (cognitoAuth instanceof Object) {
    const user = await database.findOne({ email });
    return { ...cognitoAuth, user: user.toObject() };
  }
  return { code: cognitoAuth };
};
