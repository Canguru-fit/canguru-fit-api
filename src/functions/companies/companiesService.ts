import companiesModel, { Company } from '../../schemas/company.model';

export const read = async (): Promise<Company[]> => {
  return companiesModel.find();
};

export const readOne = async (id: string): Promise<Company> => {
  return companiesModel.findById(id);
};

export const create = async (company: Company): Promise<Company> => {
  return companiesModel.create(company);
};

export const update = async (_id: string, company: Company): Promise<Company> => {
  return companiesModel.findOneAndUpdate({ _id }, company, { new: true });
};

export const remove = async (_id: string): Promise<Company> => {
  return companiesModel.findOneAndDelete({ _id });
};
