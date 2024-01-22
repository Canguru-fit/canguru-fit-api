import { Schema, InferSchemaType, model } from 'mongoose';
import { entitiesTypes } from './schema.utils';

const entity = new Schema(
  {
    name: String,
    email: String,
    cpf: String,
    cnpj: String,
    rg: String,
    phone: String,
    dob: Date,
    mothersName: String,
    type: {
      type: String,
      enum: entitiesTypes,
    },
    gender: {
      type: String,
      enum: ['MALE', 'FEMALE', ''],
    },
    diligence: {
      type: Schema.Types.ObjectId,
      ref: 'diligence',
    },
    documents: [
      {
        type: Schema.Types.ObjectId,
        ref: 'docs',
      },
    ],
  },
  {
    collection: 'Entities',
    timestamps: true,
  }
);

export type Entity = InferSchemaType<typeof entity>;

export default model('entity', entity);
