import entitiesModel from '@schemas/entities.model';
import documentsModel, { Document } from '@schemas/documents.model';
import documentTypesModel from '@schemas/documentTypes.model';
import diligencesModel, { Diligence } from '@schemas/diligences.model';
import { s3CopyObjectCommand, s3GetSignedUrlPdf, s3StreamObjectCommand, uploadFileToS3 } from '@libs/s3Utils';
import usersModel from '@schemas/users.model';
import robotsModel from '@schemas/robots.model';
import { refreshPlexiRobot, refreshRobot, startExatoRobot, startRobot, startPlexiRobot } from '../../apis/robots';
import { readOne as readSingleDoc } from '../documents/documentsService';

const buildParams = (entity, fields) => {
  const params = {};

  if (fields.includes('uf')) {
    // eslint-disable-next-line no-param-reassign
    entity.uf = 'SP';
  }

  fields.forEach((field) => {
    // eslint-disable-next-line no-prototype-builtins
    if (entity.hasOwnProperty(field)) {
      let val = entity[field];
      if (field === 'cpf' || field === 'cnpj') {
        val = val.replace(/[^\w\s]/gi, '');
      }

      params[field] = val;
    }
  });

  return params;
};

const kebabCase = (value: string): string => {
  return value
    .toLocaleLowerCase()
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
};

const buildPlexiParams = (entity, _fields) => {
  const params = {};

  switch (entity.type) {
    case 'NATURAL PERSON':
      params.cpfCnpj = entity.cpf;
      break;
    case 'LEGAL PERSON':
      params.cpfCnpj = entity.cnpj;
      break;
    default:
      break;
  }

  return params;
};

export const read = async (id: string): Promise<Diligence[]> => {
  return diligencesModel
    .find({ user: id })
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
        populate: { path: 'type', model: documentTypesModel, populate: { path: 'robot', model: robotsModel } },
      },
    })
    .populate({
      path: 'user',
      model: usersModel,
    });
};

export const create = async (diligence: Diligence, user: string): Promise<Diligence> => {
  return diligencesModel.create({ ...diligence, user, status: 'NEW', entities: [] });
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

export const collectPlexi = async (document: Document & { id: string }): Promise<Document> => {
  const foundEntity = await entitiesModel.findOne({ documents: document.id });
  const foundDocument = await readSingleDoc(document.id);
  const request = {
    url: foundDocument?.type?.robot?.url,
    params: buildPlexiParams(foundEntity.toObject(), foundDocument?.type?.robot?.mandatoryFields),
  };

  try {
    const res = await startPlexiRobot(request);
    foundDocument.protocol = res.requestId;
    foundDocument.status = 'PENDING';
    foundDocument.statusText = 'Coleta em andamento';
  } catch (error) {
    console.log(error);
    foundDocument.status = 'FAILED';
    foundDocument.statusText = 'Falha ao iniciar coleta';
  }

  return foundDocument.save();
};

export const collectExato = async (document: Document & { id: string }): Promise<Document> => {
  const foundEntity = await entitiesModel.findOne({ documents: document.id });
  const foundDocument = await readSingleDoc(document.id);
  const request = {
    url: foundDocument?.type?.robot?.url,
    params: buildParams(foundEntity.toObject(), foundDocument?.type?.robot?.mandatoryFields),
  };

  try {
    const res = await startExatoRobot(request);
    foundDocument.protocol = res.UniqueIdentifier;
    foundDocument.originalUrl = res.PdfUrl;
    foundDocument.filePath = res.PdfUrl
      ? await uploadFileToS3(
          res.PdfUrl,
          `documents/${foundDocument.diligence}/${kebabCase(foundEntity.type)}/${foundDocument._id}/${kebabCase(
            foundDocument.name
          )}`
        )
      : res.PdfUrl;
    foundDocument.status = 'COLLECTED';
    foundDocument.statusText = res?.Message;
    // eslint-disable-next-line no-nested-ternary
    foundDocument.analysisStatus = res?.Message === 'Sucesso' ? (res?.Result?.Consta ? 'Sim' : 'Não') : '';
  } catch (error) {
    console.log(error);
    foundDocument.status = 'FAILED';
    foundDocument.statusText = 'Falha ao realizar coleta';
  }

  return foundDocument.save();
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

export const statusPlexi = async (document: Document & { id: string }): Promise<Document> => {
  const foundEntity = await entitiesModel.findOne({ documents: document.id });
  const newDocument = await documentsModel.findById(document.id);

  const res = await refreshPlexiRobot(newDocument.protocol);

  if (res) {
    try {
      const path = `documents/${newDocument.diligence}/${kebabCase(foundEntity.type)}/${newDocument._id}/${kebabCase(
        newDocument.name
      )}`;

      newDocument.filePath = await s3StreamObjectCommand(res.pdf, path);
    } catch (error) {
      throw new Error(`Error while converting the file: ${error.message}`);
    }

    newDocument.originalUrl = res.pdf;
    newDocument.status = 'COLLECTED';
    newDocument.statusText = res.status;
  }

  return newDocument.save();
};

export const upload = async (document: Document & { id: string; url: string }): Promise<Document> => {
  const foundEntity = await entitiesModel.findOne({ documents: document.id });
  const newDocument = await documentsModel.findById(document.id);

  try {
    const path = `documents/${newDocument.diligence}/${kebabCase(foundEntity.type)}/${newDocument._id}/${kebabCase(
      newDocument.name
    )}`;

    newDocument.filePath = await s3CopyObjectCommand(document.url, path);
    newDocument.originalUrl = document.url;
    newDocument.status = 'COLLECTED';
    newDocument.statusText = 'Sucesso';
  } catch (error) {
    throw new Error(`Error while converting the file: ${error.message}`);
  }

  return newDocument.save();
};

export const document = async (document: Document & { id: string }): Promise<{ url: string }> => {
  const foundDocument = await documentsModel.findById(document.id);

  const url = await s3GetSignedUrlPdf(foundDocument.filePath);
  return { url };
};

export const getStatistics = async (): Promise<{ status: string; sum: number }[]> => {
  return diligencesModel.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }, // this means that the count will increment by 1
      },
    },
  ]);
};
