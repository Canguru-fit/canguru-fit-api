import documentTypesModel from '@schemas/documentTypes.model';
import diligencesModel from '@schemas/diligences.model';
import entityModel, { Entity } from '../../schemas/entities.model';
import documentsModel from '../../schemas/documents.model';

export const read = async (): Promise<Entity[]> => {
  return entityModel
    .find()
    .populate({ path: 'documents', model: documentsModel, populate: { path: 'type', model: documentTypesModel } })
    .populate({
      path: 'diligence',
      model: diligencesModel,
    });
};

export const readOne = async (id: string): Promise<Entity> => {
  return entityModel
    .findById(id)
    .populate({ path: 'documents', model: documentsModel, populate: { path: 'type', model: documentTypesModel } })
    .populate({
      path: 'diligence',
      model: diligencesModel,
    });
};

export const create = async (entity: Entity): Promise<Entity> => {
  const documentTypes = await documentTypesModel.find({ entity: entity.type });

  const documents = documentTypes.map((documentType) => {
    return {
      name: documentType.name,
      filePath: '',
      protocol: '',
      status: '',
      statusText: '',
      analysisStatus: '',
      analysisDescription: '',
      diligence: entity.diligence,
      type: documentType.id,
    };
  });

  const newDocuments = await documentsModel.insertMany(documents);

  // eslint-disable-next-line no-param-reassign
  entity.documents = newDocuments.map((doc) => doc.id);

  const newEntity = await entityModel.create(entity);

  const diligence = await diligencesModel.findById(entity.diligence);

  diligence.entities.push(newEntity.id);

  await diligence.save();

  return newEntity.populate({
    path: 'documents',
    model: documentsModel,
    populate: { path: 'type', model: documentTypesModel },
  });
};

export const update = async (_id: string, entity: Entity): Promise<Entity> => {
  return entityModel.findOneAndUpdate({ _id }, entity);
};

export const remove = async (_id: string): Promise<Entity> => {
  return entityModel.findOneAndDelete({ _id });
};
