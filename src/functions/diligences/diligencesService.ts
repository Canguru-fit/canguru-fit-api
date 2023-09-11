import diligencesModel, { Diligence } from '../../schemas/diligences.model';

export const read = async (): Promise<Diligence[]> => {
  return diligencesModel.find();
};

export const readOne = async (id: string): Promise<Diligence> => {
  return diligencesModel.findById(id);
};

export const create = async (diligence: Diligence): Promise<Diligence> => {
  return diligencesModel.create(diligence);
};

export const update = async (_id: string, diligence: Diligence): Promise<Diligence> => {
  return diligencesModel.findOneAndUpdate({ _id }, diligence);
};

export const remove = async (_id: string): Promise<Diligence> => {
  return diligencesModel.findOneAndDelete({ _id });
};
