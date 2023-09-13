import naturalPersonsModel from '@schemas/naturalPersons.model';
import legalPersonsModel from '@schemas/legalPersons.model';
import naturalPersonDocsModel, { NaturalPersonDoc } from '@schemas/naturalPersonDocs.model';
import documentTypesModel from '@schemas/documentTypes.model';
import legalPersonDocsModel, { LegalPersonDoc } from '@schemas/legalPersonDocs.model';
import diligencesModel, { Diligence } from '@schemas/diligences.model';
import { s3CopyObjectCommand, s3GetSignedUrl } from '@libs/s3Utils';
import { refreshRobot, startRobot } from '../../apis/robots';

export const read = async (): Promise<Diligence[]> => {
  return diligencesModel
    .find()
    .populate({
      path: 'naturalPersons',
      model: naturalPersonsModel,
      populate: {
        path: 'documents',
        model: naturalPersonDocsModel,
        populate: { path: 'type', model: documentTypesModel },
      },
    })
    .populate({
      path: 'legalPersons',
      model: legalPersonsModel,
      populate: {
        path: 'documents',
        model: legalPersonDocsModel,
        populate: { path: 'type', model: documentTypesModel },
      },
    });
};

export const readOne = async (id: string): Promise<Diligence> => {
  return diligencesModel
    .findById(id)
    .populate({
      path: 'naturalPersons',
      model: naturalPersonsModel,
      populate: {
        path: 'documents',
        model: naturalPersonDocsModel,
        populate: { path: 'type', model: documentTypesModel },
      },
    })
    .populate({
      path: 'legalPersons',
      model: legalPersonsModel,
      populate: {
        path: 'documents',
        model: legalPersonDocsModel,
        populate: { path: 'type', model: documentTypesModel },
      },
    });
};

export const create = async (diligence: Diligence): Promise<Diligence> => {
  return diligencesModel.create(diligence);
};

export const update = async (_id: string, diligence: Diligence): Promise<Diligence> => {
  return diligencesModel.findOneAndUpdate({ _id }, diligence);
};

export const remove = async (_id: string): Promise<Diligence> => {
  return diligencesModel.findOneAndDelete({ _id });
};

export const collect = async (
  document: (NaturalPersonDoc & { id: string }) | (LegalPersonDoc & { id: string }),
  entity: string
): Promise<NaturalPersonDoc | LegalPersonDoc> => {
  let newDocument = null;
  let request = null;

  if (entity === 'NATURAL PERSON') {
    const naturalPerson = await naturalPersonsModel.findOne({ documents: document.id });
    newDocument = await naturalPersonDocsModel.findById(document.id);
    request = {
      robot_type_id: '19',
      property_id: newDocument.diligence,
      entity_type_id: '1',
      cpf_number: naturalPerson.cpf,
      name: naturalPerson.name,
    };
  } else {
    const legalPerson = await legalPersonsModel.findOne({ documents: document.id });
    newDocument = await legalPersonDocsModel.findById(document.id);
    request = {
      robot_type_id: '19',
      property_id: document.diligence,
      entity_type_id: '2',
      cnpj_number: legalPerson.cnpj,
      name: legalPerson.name,
    };
  }

  const res = await startRobot(request);
  newDocument.protocol = res.protocol;

  return newDocument.save();
};

export const status = async (
  document: (NaturalPersonDoc & { id: string }) | (LegalPersonDoc & { id: string }),
  entity: string
): Promise<NaturalPersonDoc | LegalPersonDoc> => {
  let newDocument = null;
  if (entity === 'NATURAL PERSON') {
    newDocument = await naturalPersonDocsModel.findById(document.id);
  } else {
    newDocument = await legalPersonDocsModel.findById(document.id);
  }
  const [res] = await refreshRobot([newDocument.protocol]);
  newDocument.filePath = res.path
    ? await s3CopyObjectCommand(res.path, `documents/${newDocument.id}/${newDocument.name}`)
    : res.path;
  newDocument.analysisStatus = res.evaluation;
  newDocument.status = res.status_id;
  newDocument.statusText = res.status;

  return newDocument.save();
};

export const document = async (
  document: (NaturalPersonDoc & { id: string }) | (LegalPersonDoc & { id: string }),
  entity: string
): Promise<{ url: string }> => {
  let foundDocument = null;
  if (entity === 'NATURAL PERSON') {
    foundDocument = await naturalPersonDocsModel.findById(document.id);
  } else {
    foundDocument = await legalPersonDocsModel.findById(document.id);
  }

  const url = await s3GetSignedUrl(foundDocument.filePath);
  return { url };
};
