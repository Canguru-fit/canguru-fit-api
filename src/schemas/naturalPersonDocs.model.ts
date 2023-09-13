import { Schema, InferSchemaType, model } from 'mongoose';

const naturalPersonDoc = new Schema(
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
    collection: 'NaturalPersonDocs',
    timestamps: true,
  }
);

export type NaturalPersonDoc = InferSchemaType<typeof naturalPersonDoc>;

export default model('naturalPersonDoc', naturalPersonDoc);
