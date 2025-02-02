import { createUser } from '@libs/cognitoUtils';
import Exception from '@libs/Exceptions';
import { personalsModel, Student, studentsModel } from '@schemas/index';

export const readOne = async (id: string): Promise<Student> => {
  return studentsModel.findById(id);
};

export const read = async (personalId): Promise<Student[]> => {
  return studentsModel.find({ personals: personalId });
};

export const create = async (personalId, data: Student): Promise<Student> => {
  const { email, name } = data;

  const foundStudent = await studentsModel.findOne({ email });
  if (foundStudent) {
    if (foundStudent.personals.includes(personalId)) throw new Exception(Exception.USER_ALREADY_EXIST);
    await personalsModel.findByIdAndUpdate(personalId, { $push: { students: foundStudent._id } });
    foundStudent.personals.push(personalId);
    return foundStudent.save();
  }
  await createUser(email, name, process.env.AWS_COGNITO_POOL_ID);
  // eslint-disable-next-line new-cap
  const student = new studentsModel({ ...data, personals: [personalId] });
  await personalsModel.findByIdAndUpdate(personalId, { $push: { students: student._id } });
  console.log(JSON.stringify(student));
  return student.save();
};

export const update = async (id: string, data: Partial<Student & { _id: string }>): Promise<Student> => {
  const { _id = id, ...dataObj } = data;
  return studentsModel.findOneAndUpdate({ _id }, dataObj, { new: true });
};

export const remove = async (personalId, id: string): Promise<Student> => {
  await personalsModel.findByIdAndUpdate(personalId, { $pull: { students: id } }, { new: true });
  return studentsModel.findByIdAndUpdate(id, { $pull: { personals: personalId } }, { new: true });
};
