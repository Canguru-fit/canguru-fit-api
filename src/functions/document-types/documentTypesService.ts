import documentTypesModel, { DocumentType } from '../../schemas/documentTypes.model';
import robotsModel from '../../schemas/robots.model';

export const read = async (): Promise<DocumentType[]> => {
  return documentTypesModel.find().populate({ path: 'robot', model: robotsModel });
};

export const readOne = async (id: string): Promise<DocumentType> => {
  return documentTypesModel.findById(id).populate({ path: 'robot', model: robotsModel });
};

export const create = async (documentType: DocumentType): Promise<DocumentType> => {
  return documentTypesModel.create(documentType);
};

export const update = async (_id: string, documentType: DocumentType): Promise<DocumentType> => {
  return documentTypesModel.findOneAndUpdate({ _id }, documentType);
};

export const remove = async (_id: string): Promise<DocumentType> => {
  return documentTypesModel.findOneAndDelete({ _id });
};
