import naturalPersonModel, { NaturalPerson } from '../../schemas/naturalPersons.model';

export const read = async (): Promise<NaturalPerson[]> => {
  return naturalPersonModel.find();
};

export const readOne = async (id: string): Promise<NaturalPerson> => {
  return naturalPersonModel.findById(id);
};

export const create = async (naturalPerson: NaturalPerson): Promise<NaturalPerson> => {
  return naturalPersonModel.create(naturalPerson);
};

export const update = async (_id: string, naturalPerson: NaturalPerson): Promise<NaturalPerson> => {
  return naturalPersonModel.findOneAndUpdate({ _id }, naturalPerson);
};

export const remove = async (_id: string): Promise<NaturalPerson> => {
  return naturalPersonModel.findOneAndDelete({ _id });
};
