import usersModel, { User } from '../../schemas/users.model';
import { createUser, deleteUser, toggleUserStatus, resendTempPassword } from '../../libs/congitoUtils';

export const read = async (): Promise<User[]> => {
  return usersModel.find();
};

export const readOne = async (id: string): Promise<User> => {
  return usersModel.findById(id);
};

export const create = async (user: User): Promise<User> => {
  const foundUser = await usersModel.findOne({ email: user.email });

  if (foundUser) throw new Error('User already exists!');

  try {
    await createUser(user.email);
    return usersModel.create({
      ...user,
      termsAndConditions: true,
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
