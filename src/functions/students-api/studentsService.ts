import Exception from '@libs/Exceptions';
import { Student, studentsModel } from '@schemas/index';

export const readOne = async (id: string): Promise<Student> => {
  return studentsModel.findById(id);
};

export const read = async (): Promise<Student[]> => {
  return studentsModel.find();
};

export const create = async (data: Student): Promise<Student> => {
  return studentsModel.create(data);
};

export const update = async (id: string, data: Partial<Student>): Promise<Student> => {
  // remove _id to protect on save
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, ...dataObj } = data;
  return studentsModel.findOneAndUpdate({ _id: id }, dataObj, { new: true });
};

export const remove = async (id: string): Promise<Student> => {
  return studentsModel.findOneAndDelete({ _id: id }).then((data) => {
    if (!data) throw new Exception(Exception.DATA_NOT_FOUND);
    return data;
  });
};