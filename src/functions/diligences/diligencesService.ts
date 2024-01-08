import entitiesModel from '@schemas/entities.model';
import documentsModel, { Document } from '@schemas/documents.model';
import documentTypesModel from '@schemas/documentTypes.model';
import diligencesModel, { Diligence } from '@schemas/diligences.model';
import { s3CopyObjectCommand, s3GetSignedUrl } from '@libs/s3Utils';
import usersModel from '@schemas/users.model';
import { refreshRobot, startRobot } from '../../apis/robots';

export const read = async (): Promise<Diligence[]> => {
  return diligencesModel
    .find()
    .populate({
      path: 'entities',
      model: entitiesModel,
      populate: {
        path: 'documents',
        model: documentsModel,
        populate: { path: 'type', model: documentTypesModel },
      },
    })
    .populate({
      path: 'user',
      model: usersModel,
    });
};

export const readOne = async (id: string): Promise<Diligence> => {
  return diligencesModel
    .findById(id)
    .populate({
      path: 'entities',
      model: entitiesModel,
      populate: {
        path: 'documents',
        model: documentsModel,
        populate: { path: 'type', model: documentTypesModel },
      },
    })
    .populate({
      path: 'user',
      model: usersModel,
    });
};

export const create = async (diligence: Diligence): Promise<Diligence> => {
  return diligencesModel.create({ ...diligence, status: 'NEW', entities: [] });
};

export const update = async (_id: string, diligence: Diligence): Promise<Diligence> => {
  return diligencesModel.findOneAndUpdate({ _id }, diligence);
};

export const remove = async (_id: string): Promise<Diligence> => {
  return diligencesModel.findOneAndDelete({ _id });
};

export const collect = async (document: Document & { id: string }): Promise<Document> => {
  let newDocument = null;
  let request = null;

  const foundEntity = await entitiesModel.findOne({ documents: document.id });
  newDocument = await entitiesModel.findById(document.id);
  request = {
    robot_type_id: '19',
    property_id: newDocument.diligence,
    entity_type_id: foundEntity.type === 'NATURAL PERSON' ? '1' : '2',
    cpf_number: foundEntity.cpf,
    cnpj_number: foundEntity.cnpj,
    name: foundEntity.name,
  };

  const res = await startRobot(request);
  newDocument.protocol = res.protocol;

  return newDocument.save();
};

export const status = async (document: Document & { id: string }): Promise<Document> => {
  const newDocument = await documentsModel.findById(document.id);

  const [res] = await refreshRobot([newDocument.protocol]);
  newDocument.filePath = res.path
    ? await s3CopyObjectCommand(res.path, `documents/${newDocument.id}/${newDocument.name}`)
    : res.path;
  newDocument.analysisStatus = res.evaluation;
  newDocument.status = res.status_id;
  newDocument.statusText = res.status;

  return newDocument.save();
};

export const document = async (document: Document & { id: string }): Promise<{ url: string }> => {
  const foundDocument = await documentsModel.findById(document.id);

  const url = await s3GetSignedUrl(foundDocument.filePath);
  return { url };
};
