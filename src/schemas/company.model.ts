import { Schema, InferSchemaType, model } from 'mongoose';

const company = new Schema(
  {
    name: String,
    cnpj: String,
    email: String,
    phone: String,
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
  },
  {
    collection: 'Companies',
    timestamps: true,
  }
);

export type Company = InferSchemaType<typeof company>;

export default model('company', company);
