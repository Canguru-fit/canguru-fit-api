import { Schema, InferSchemaType, model } from 'mongoose';

const naturalPerson = new Schema(
  {
    name: String,
    email: String,
    cpf: String,
    rg: String,
    phone: String,
    dob: Date,
    mothersName: String,
    gender: {
      type: String,
      enum: ['MALE', 'FEMALE'],
    },
    diligence: {
      type: Schema.Types.ObjectId,
      ref: 'diligence',
    },
    documents: [
      {
        type: Schema.Types.ObjectId,
        ref: 'naturalPersonDocs',
      },
    ],
  },
  {
    collection: 'NaturalPersons',
    timestamps: true,
  }
);

export type NaturalPerson = InferSchemaType<typeof naturalPerson>;

export default model('naturalPerson', naturalPerson);
