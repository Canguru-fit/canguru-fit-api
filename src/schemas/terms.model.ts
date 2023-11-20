import { Schema, InferSchemaType, model } from 'mongoose';

const documentTerm = new Schema(
  {
    documentId: String,
    terms: Array,
  },
  {
    collection: 'DocumentsTerms',
    timestamps: true,
  }
);

export type DocumentTerm = InferSchemaType<typeof documentTerm>;

export default model('documentTerm', documentTerm);
