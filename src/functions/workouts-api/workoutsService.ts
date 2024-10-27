import Exception from '@libs/Exceptions';
import { Workout, workoutsModel } from '@schemas/index';

export const readOne = async (id: string): Promise<Workout> => {
  return workoutsModel.findById(id);
};

export const read = async (): Promise<Workout[]> => {
  return workoutsModel.find();
};

export const create = async (data: Workout): Promise<Workout> => {
  return workoutsModel.create(data);
};

export const update = async (id: string, data: Partial<Workout>): Promise<Workout> => {
  // remove _id to protect on save
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, ...dataObj } = data;
  return workoutsModel.findOneAndUpdate({ _id: id }, dataObj, { new: true });
};

export const remove = async (id: string): Promise<Workout> => {
  return workoutsModel.findOneAndDelete({ _id: id }).then((data) => {
    if (!data) throw new Exception(Exception.DATA_NOT_FOUND);
    return data;
  });
};
