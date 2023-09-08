import { Schema, InferSchemaType, model } from 'mongoose';

let legalPerson = new Schema(
  {
    name: String,
    email: String,
    cnpj: String,
    phone: String,
  },
  {
    collection: 'LegallPersons',
    timestamps: true
  }
);

export type LegallPerson = InferSchemaType<typeof legalPerson>;

export default model('legalPerson', legalPerson);


