import { Schema, InferSchemaType, model } from 'mongoose';

const legalPersonDoc = new Schema(
  {
    name: String,
    filePath: String,
    protocol: String,
    collectionStatus: String,
    diligence: {
      type: Schema.Types.ObjectId,
      ref: 'diligence',
    },
    legalPerson: {
      type: Schema.Types.ObjectId,
      ref: 'legalPerson',
    },
  },
  {
    collection: 'LegalPersonDocs',
    timestamps: true,
  }
);

export type LegalPersonDoc = InferSchemaType<typeof legalPersonDoc>;

export default model('doc', legalPersonDoc);
