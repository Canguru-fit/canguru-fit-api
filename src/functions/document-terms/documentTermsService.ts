import documentTermsModel, { DocumentTerm } from '../../schemas/terms.model';

export const read = async (): Promise<DocumentTerm[]> => {
  return documentTermsModel.find();
};

export const readOne = async (id: string): Promise<DocumentTerm> => {
  return documentTermsModel.findById(id);
};

export const create = async (documentTerm: DocumentTerm): Promise<DocumentTerm> => {
  return documentTermsModel.create(documentTerm);
};

export const update = async (_id: string, documentTerm: DocumentTerm): Promise<DocumentTerm> => {
  return documentTermsModel.findOneAndUpdate({ _id }, documentTerm);
};

export const remove = async (_id: string): Promise<DocumentTerm> => {
  return documentTermsModel.findOneAndDelete({ _id });
};
