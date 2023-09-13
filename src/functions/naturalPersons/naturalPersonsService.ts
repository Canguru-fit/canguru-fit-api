import naturalPersonDocsModel from '@schemas/naturalPersonDocs.model';
import documentTypesModel from '@schemas/documentTypes.model';
import diligencesModel from '@schemas/diligences.model';
import naturalPersonModel, { NaturalPerson } from '../../schemas/naturalPersons.model';

export const read = async (): Promise<NaturalPerson[]> => {
  return naturalPersonModel.find().populate({
    path: 'documents',
    model: naturalPersonDocsModel,
    populate: { path: 'type', model: documentTypesModel },
  });
};

export const readOne = async (id: string): Promise<NaturalPerson> => {
  return naturalPersonModel.findById(id).populate({
    path: 'documents',
    model: naturalPersonDocsModel,
    populate: { path: 'type', model: documentTypesModel },
  });
};

export const create = async (naturalPerson: NaturalPerson): Promise<NaturalPerson> => {
  const documentTypes = await documentTypesModel.find({ entity: 'NATURAL PERSON' });

  const documents = documentTypes.map((documentType) => {
    return {
      name: documentType.name,
      filePath: '',
      protocol: '',
      status: '',
      statusText: '',
      analysisStatus: '',
      analysisDescription: '',
      diligence: naturalPerson.diligence,
      type: documentType.id,
    };
  });

  const newDocuments = await naturalPersonDocsModel.insertMany(documents);

  // eslint-disable-next-line no-param-reassign
  naturalPerson.documents = await newDocuments.map((doc) => doc.id);

  const newNaturalPerson = await naturalPersonModel.create(naturalPerson);

  const diligence = await diligencesModel.findById(naturalPerson.diligence);

  diligence.naturalPersons.push(newNaturalPerson.id);

  await diligence.save();

  return newNaturalPerson.populate({
    path: 'documents',
    model: naturalPersonDocsModel,
    populate: { path: 'type', model: documentTypesModel },
  });
};

export const update = async (_id: string, naturalPerson: NaturalPerson): Promise<NaturalPerson> => {
  return naturalPersonModel.findOneAndUpdate({ _id }, naturalPerson);
};

export const remove = async (_id: string): Promise<NaturalPerson> => {
  return naturalPersonModel.findOneAndDelete({ _id });
};
