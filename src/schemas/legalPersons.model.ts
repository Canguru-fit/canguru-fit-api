import { Schema, InferSchemaType, model } from 'mongoose';

const legalPerson = new Schema(
  {
    name: String,
    email: String,
    cnpj: String,
    phone: String,
  },
  {
    collection: 'LegallPersons',
    timestamps: true,
  }
);

export type LegalPerson = InferSchemaType<typeof legalPerson>;

export default model('legalPerson', legalPerson);
