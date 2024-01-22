import documentTypesModel, { DocumentType } from '../../schemas/documentTypes.model';
import documentModel, { Document } from '../../schemas/documents.model';
import robotsModel, { Robot } from '../../schemas/robots.model';

export const readOne = async (
  id: string
): Promise<Document & { _id: string; type: DocumentType & { robot: Robot } }> => {
  return documentModel
    .findById(id)
    .populate({ path: 'type', model: documentTypesModel, populate: { path: 'robot', model: robotsModel } });
};
