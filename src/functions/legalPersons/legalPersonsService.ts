import legalPersonModel, { LegalPerson } from '../../schemas/legalPersons.model';

export const read = async (): Promise<LegalPerson[]> => {
  return legalPersonModel.find();
};

export const readOne = async (id: string): Promise<LegalPerson> => {
  return legalPersonModel.findById(id);
};

export const create = async (LegalPerson: LegalPerson): Promise<LegalPerson> => {
  return legalPersonModel.create(LegalPerson);
};

export const update = async (_id: string, LegalPerson: LegalPerson): Promise<LegalPerson> => {
  return legalPersonModel.findOneAndUpdate({ _id }, LegalPerson);
};

export const remove = async (_id: string): Promise<LegalPerson> => {
  return legalPersonModel.findOneAndDelete({ _id });
};
