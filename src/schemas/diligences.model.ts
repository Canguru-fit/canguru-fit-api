import { Schema, InferSchemaType, model } from 'mongoose';

const diligence = new Schema(
  {
    stauts: {
      type: String,
      enum: ['NEW', 'IN PROGRESS', 'COMPLETED'],
    },
    name: String,
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    entities: [
      {
        type: Schema.Types.ObjectId,
        ref: 'entity',
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
