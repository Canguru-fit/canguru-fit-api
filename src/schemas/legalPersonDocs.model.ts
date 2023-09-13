import { Schema, InferSchemaType, model } from 'mongoose';

const legalPersonDoc = new Schema(
  {
    name: String,
    filePath: String,
    protocol: String,
    status: String,
    statusText: String,
    analysisStatus: String,
    analysisDescription: String,
    diligence: {
      type: Schema.Types.ObjectId,
      ref: 'diligence',
    },
    type: {
      type: Schema.Types.ObjectId,
      ref: 'documentType',
    },
  },
  {
    collection: 'LegalPersonDocs',
    timestamps: true,
  }
);

export type LegalPersonDoc = InferSchemaType<typeof legalPersonDoc>;

export default model('doc', legalPersonDoc);
