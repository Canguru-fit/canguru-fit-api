import { Personal, personalsModel } from '@schemas/index';

export const read = async (): Promise<Personal[]> => {
  return personalsModel.find();
};

export const readOne = async (id: string): Promise<Personal> => {
  return personalsModel.findById(id);
};

export const create = async (body): Promise<Personal> => {
  return personalsModel.create(body);
};

export const update = async (_id: string, user: Personal): Promise<Personal> => {
  return personalsModel.findOneAndUpdate({ _id }, user);
};

export const remove = async (id: string): Promise<Personal> => {
  const user = await personalsModel.findById(id);

  if (!user) throw new Error('User not found');

  try {
    return personalsModel.findOneAndDelete({ id });
  } catch (error) {
    throw new Error(error.message);
  }
};
