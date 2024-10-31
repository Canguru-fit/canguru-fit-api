import * as cognitoUtils from '@libs/cognitoUtils';
import Exception from '@libs/Exceptions';

type ISource = 'personal' | 'student';

const cognito = {
  personal: {
    UserPoolId: process.env.AWS_COGNITO_PERSONAL_POOL_ID,
    ClientId: process.env.AWS_COGNITO_PERSONAL_CLIENT_ID,
  },
  student: {
    UserPoolId: process.env.AWS_COGNITO_POOL_ID,
    ClientId: process.env.AWS_COGNITO_CLIENT_ID,
  },
};

export const signUp = (source: ISource, body: { email: string; password: string }) => {
  const { ClientId } = cognito[source];
  const { email, password } = body;
  try {
    return cognitoUtils.signUpUser(email?.toLowerCase(), password, ClientId);
  } catch (error) {
    if (error.name === 'UsernameExistsException') throw new Exception(Exception.USER_ALREADY_EXIST);
    throw Error(error);
  }
};

export const login = (source: ISource, body: { email: string; password: string }) => {
  const { ClientId } = cognito[source];
  const { email, password } = body;
  try {
    return cognitoUtils.initiateAuth(
      {
        USERNAME: email,
        PASSWORD: password,
      },
      ClientId
    );
  } catch (error) {
    throw Error(error);
  }
};

export const validateToken = (source: ISource, authorization: string) => {
  return cognitoUtils.verifyToken(authorization, cognito[source].UserPoolId).catch((error) => {
    console.log(error);
    throw new Exception(Exception.UNAUTHORIZED);
  });
};

export const refreshToken = (source: ISource, body) => {
  const { ClientId } = cognito[source];
  const { email, refreshToken } = body;
  try {
    return cognitoUtils.initiateAuth({ REFRESH_TOKEN: refreshToken }, ClientId, 'REFRESH_TOKEN');
  } catch (error) {
    throw Error(error);
  }
};
