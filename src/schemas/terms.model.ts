import { Schema, InferSchemaType, model } from 'mongoose';

const documentTerm = new Schema(
  {
    documents: [
      {
        type: Schema.Types.ObjectId,
        ref: 'documentType',
      },
    ],
    terms: Array,
  },
  {
    collection: 'DocumentsTerms',
    timestamps: true,
  }
);

export type DocumentTerm = InferSchemaType<typeof documentTerm>;

export default model('documentTerm', documentTerm);
