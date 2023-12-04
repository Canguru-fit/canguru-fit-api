import { Schema, InferSchemaType, model } from 'mongoose';

const document = new Schema(
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
    collection: 'Documents',
    timestamps: true,
  }
);

export type Document = InferSchemaType<typeof document>;

export default model('document', document);
