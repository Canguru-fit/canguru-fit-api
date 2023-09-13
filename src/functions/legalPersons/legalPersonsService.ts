import documentTypesModel from '@schemas/documentTypes.model';
import diligencesModel from '@schemas/diligences.model';
import legalPersonModel, { LegalPerson } from '../../schemas/legalPersons.model';
import documentsModel from '../../schemas/legalPersonDocs.model';

export const read = async (): Promise<LegalPerson[]> => {
  return legalPersonModel
    .find()
    .populate({ path: 'documents', model: documentsModel, populate: { path: 'type', model: documentTypesModel } });
};

export const readOne = async (id: string): Promise<LegalPerson> => {
  return legalPersonModel
    .findById(id)
    .populate({ path: 'documents', model: documentsModel, populate: { path: 'type', model: documentTypesModel } });
};

export const create = async (legalPerson: LegalPerson): Promise<LegalPerson> => {
  const documentTypes = await documentTypesModel.find({ entity: 'LEGAL PERSON' });

  const documents = documentTypes.map((documentType) => {
    return {
      name: documentType.name,
      filePath: '',
      protocol: '',
      status: '',
      statusText: '',
      analysisStatus: '',
      analysisDescription: '',
      diligence: legalPerson.diligence,
      type: documentType.id,
    };
  });

  const newDocuments = await documentsModel.insertMany(documents);

  // eslint-disable-next-line no-param-reassign
  legalPerson.documents = await newDocuments.map((doc) => doc.id);

  const newlegalPerson = await legalPersonModel.create(legalPerson);

  const diligence = await diligencesModel.findById(legalPerson.diligence);

  diligence.legalPersons.push(newlegalPerson.id);

  await diligence.save();

  return newlegalPerson.populate({
    path: 'documents',
    model: documentsModel,
    populate: { path: 'type', model: documentTypesModel },
  });
};

export const update = async (_id: string, LegalPerson: LegalPerson): Promise<LegalPerson> => {
  return legalPersonModel.findOneAndUpdate({ _id }, LegalPerson);
};

export const remove = async (_id: string): Promise<LegalPerson> => {
  return legalPersonModel.findOneAndDelete({ _id });
};
