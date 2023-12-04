import { Schema, InferSchemaType, model } from 'mongoose';

const company = new Schema(
  {
    name: String,
    cnpj: String,
    email: String,
    phone: String,
  },
  {
    collection: 'Companies',
    timestamps: true,
  }
);

export type Company = InferSchemaType<typeof company>;

export default model('company', company);
