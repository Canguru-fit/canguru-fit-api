import Exception from '@libs/Exceptions';
import { Exercise, exercisesModel } from '@schemas/index';

export const readOne = async (id: string): Promise<Exercise> => {
  return exercisesModel.findById(id);
};

export const read = async (): Promise<Exercise[]> => {
  return exercisesModel.find();
};

export const create = async (data: Exercise): Promise<Exercise> => {
  return exercisesModel.create(data);
};

export const update = async (id: string, data: Partial<Exercise>): Promise<Exercise> => {
  // remove _id to protect on save
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, ...dataObj } = data;
  return exercisesModel.findOneAndUpdate({ _id: id }, dataObj, { new: true });
};

export const remove = async (id: string): Promise<Exercise> => {
  return exercisesModel.findOneAndDelete({ _id: id }).then((data) => {
    if (!data) throw new Exception(Exception.DATA_NOT_FOUND);
    return data;
  });
};
