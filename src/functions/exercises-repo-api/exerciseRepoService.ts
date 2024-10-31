import Exception from '@libs/Exceptions';
import { ExercisesRepo, exercisesRepoModel } from '@schemas/index';

export const readOne = async (id: string): Promise<ExercisesRepo> => {
  return exercisesRepoModel.findById(id);
};

export const read = async (): Promise<ExercisesRepo[]> => {
  return exercisesRepoModel.find();
};

export const create = async (data: ExercisesRepo): Promise<ExercisesRepo> => {
  return exercisesRepoModel.create(data);
};

export const update = async (id: string, data: Partial<ExercisesRepo>): Promise<ExercisesRepo> => {
  // remove _id to protect on save
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, ...dataObj } = data;
  return exercisesRepoModel.findOneAndUpdate({ _id: id }, dataObj, { new: true });
};

export const remove = async (id: string): Promise<ExercisesRepo> => {
  return exercisesRepoModel.findOneAndDelete({ _id: id }).then((data) => {
    if (!data) throw new Exception(Exception.DATA_NOT_FOUND);
    return data;
  });
};
