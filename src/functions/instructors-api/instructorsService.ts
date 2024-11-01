import instructorsModel, { Instructor } from '../../schemas/instructors.model';
import {
  signUpUser,
  deleteUser,
  toggleUserStatus,
  resendTempPassword,
  initiateAuth,
  verifyToken as verifySession,
  forgotPassword,
  confirmForgotPassword,
} from '../../libs/cognitoUtils';

export const read = async (): Promise<Instructor[]> => {
  return instructorsModel.find();
};

export const readOne = async (id: string): Promise<Instructor> => {
  return instructorsModel.findById(id);
};

export const create = async (user: Instructor & { password: string }): Promise<Instructor> => {
  const foundUser = await instructorsModel.findOne({ email: user.email });

  if (foundUser) throw new Error('User already exists!');

  try {
    await signUpUser(user.email, user.password);
    return instructorsModel.create({
      ...user,
      status: true,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const resendTemporaryPassword = async (id: string): Promise<void> => {
  const user = await instructorsModel.findById(id);

  if (!user) throw new Error('User not found');

  try {
    resendTempPassword(user.email);
  } catch (error) {}
};

export const update = async (_id: string, user: Instructor): Promise<Instructor> => {
  return instructorsModel.findOneAndUpdate({ _id }, user);
};

export const toggleStatus = async (_id: string, user: Instructor): Promise<Instructor> => {
  try {
    await toggleUserStatus(user.email, user.status);
    return instructorsModel.findOneAndUpdate({ _id }, { status: user.status });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const remove = async (id: string): Promise<Instructor> => {
  const user = await instructorsModel.findById(id);

  if (!user) throw new Error('User not found');

  try {
    await deleteUser(user.email);
    return instructorsModel.findOneAndDelete({ id });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const login = async ({ email, password }): Promise<Instructor> => {
  const user = await instructorsModel.findOne({ email });

  if (!user) throw new Error('User not found');

  try {
    const response = await initiateAuth({ username: email, password });
    return {
      ...response,
      ...user.toObject({ getters: true }),
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const verifyToken = async (req): Promise<Instructor> => {
  try {
    return verifySession(req);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const forgot = async ({ email }): Promise<unknown> => {
  const user = await instructorsModel.findOne({ email });

  if (!user) throw new Error('User not found');

  try {
    return forgotPassword(email);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updatePassword = async ({ code, username, newPassword }): Promise<unknown> => {
  if (!code) throw new Error('Missing code');

  try {
    return confirmForgotPassword(code, username, newPassword);
  } catch (error) {
    throw new Error(error.message);
  }
};
