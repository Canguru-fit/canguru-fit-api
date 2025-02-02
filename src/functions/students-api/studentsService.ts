import { createUser } from '@libs/cognitoUtils';
import Exception from '@libs/Exceptions';
import { Personal, personalsModel, Student, studentsModel } from '@schemas/index';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IUser = (Personal | Student) & { _id: any };

export const readOne = async (id: string): Promise<Student> => {
  return studentsModel.findById(id);
};

export const read = async (user: IUser): Promise<Student[]> => {
  return studentsModel.find({ personals: user?._id });
};

export const create = async (user: IUser, data: Student): Promise<Student> => {
  const { email, name } = data;
  const personalId = user._id;
  const foundStudent = await studentsModel.findOne({ email });
  if (foundStudent) {
    if (foundStudent.personals.includes(personalId)) throw new Exception(Exception.USER_ALREADY_EXIST);
    await personalsModel.findByIdAndUpdate(personalId, { $push: { students: foundStudent._id } });
    foundStudent.personals.push(personalId);
    return foundStudent.save();
  }
  const newUser = await createUser(email, name, process.env.AWS_COGNITO_POOL_ID);

  // eslint-disable-next-line new-cap
  const student = new studentsModel({ ...data, personals: [personalId], cognitoId: newUser.User.Username });
  await personalsModel.findByIdAndUpdate(personalId, { $push: { students: student._id } });
  console.log(JSON.stringify(student));
  return student.save();
};

export const update = async (id: string, data: Partial<Student & { _id: string }>): Promise<Student> => {
  const { _id = id, ...dataObj } = data;
  return studentsModel.findOneAndUpdate({ _id }, dataObj, { new: true });
};

export const remove = async (user: IUser, id: string): Promise<Student> => {
  await personalsModel.findByIdAndUpdate(user._id, { $pull: { students: id } }, { new: true });
  return studentsModel.findByIdAndUpdate(id, { $pull: { personals: user._id } }, { new: true });
};
