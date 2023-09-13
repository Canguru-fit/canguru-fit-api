import { Schema, InferSchemaType, model } from 'mongoose';

const legalPerson = new Schema(
  {
    name: String,
    email: String,
    cnpj: String,
    phone: String,
    diligence: {
      type: Schema.Types.ObjectId,
      ref: 'diligence',
    },
    documents: [
      {
        type: Schema.Types.ObjectId,
        ref: 'legalPersonDocs',
      },
    ],
  },
  {
    collection: 'LegalPersons',
    timestamps: true,
  }
);

export type LegalPerson = InferSchemaType<typeof legalPerson>;

export default model('legalPerson', legalPerson);
