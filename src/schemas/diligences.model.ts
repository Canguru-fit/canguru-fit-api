import { Schema, InferSchemaType, model } from 'mongoose';

const diligence = new Schema(
  {
    stauts: {
      type: String,
      enum: ['NEW', 'IN PROGRESS', 'COMPLETED'],
    },
    name: String,
    naturalPersons: [
      {
        type: Schema.Types.ObjectId,
        ref: 'naturalPerson',
      },
    ],
    legalPersons: [
      {
        type: Schema.Types.ObjectId,
        ref: 'legalPerson',
      },
    ],
  },
  {
    collection: 'Diligences',
    timestamps: true,
  }
);

export type Diligence = InferSchemaType<typeof diligence>;

export default model('diligence', diligence);
