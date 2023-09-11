import robotsModel, { Robot } from '../../schemas/robots.model';

export const read = async (): Promise<Robot[]> => {
  return robotsModel.find();
};

export const readOne = async (id: string): Promise<Robot> => {
  return robotsModel.findById(id);
};

export const create = async (robot: Robot): Promise<Robot> => {
  return robotsModel.create(robot);
};

export const update = async (_id: string, robot: Robot): Promise<Robot> => {
  return robotsModel.findOneAndUpdate({ _id }, robot);
};

export const remove = async (_id: string): Promise<Robot> => {
  return robotsModel.findOneAndDelete({ _id });
};
