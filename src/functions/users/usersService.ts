import companyModel from '../../schemas/company.model';
import usersModel, { User } from '../../schemas/users.model';
import {
  signUpUser,
  deleteUser,
  toggleUserStatus,
  resendTempPassword,
  initiateAuth,
  verifyToken as verifySession,
} from '../../libs/congitoUtils';

export const read = async (): Promise<User[]> => {
  return usersModel.find().populate({ path: 'company', model: companyModel });
};

export const readOne = async (id: string): Promise<User> => {
  return usersModel.findById(id).populate({ path: 'company', model: companyModel });
};

export const create = async (user: User & { password: string }): Promise<User> => {
  const foundUser = await usersModel.findOne({ email: user.email });

  if (foundUser) throw new Error('User already exists!');

  try {
    await signUpUser(user.email, user.password);
    return usersModel.create({
      ...user,
      status: true,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const resendTemporaryPassword = async (id: string): Promise<void> => {
  const user = await usersModel.findById(id);

  if (!user) throw new Error('User not found');

  try {
    resendTempPassword(user.email);
  } catch (error) {}
};

export const update = async (_id: string, user: User): Promise<User> => {
  return usersModel.findOneAndUpdate({ _id }, user);
};

export const toggleStatus = async (_id: string, user: User): Promise<User> => {
  try {
    await toggleUserStatus(user.email, user.status);
    return usersModel.findOneAndUpdate({ _id }, { status: user.status });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const remove = async (id: string): Promise<User> => {
  const user = await usersModel.findById(id);

  if (!user) throw new Error('User not found');

  try {
    await deleteUser(user.email);
    return usersModel.findOneAndDelete({ id });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const login = async ({ email, password }): Promise<User> => {
  const user = await usersModel.findOne({ email }).populate({
    path: 'company',
    model: companyModel,
  });

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

export const verifyToken = async (req): Promise<User> => {
  try {
    return verifySession(req);
  } catch (error) {
    throw new Error(error.message);
  }
};
