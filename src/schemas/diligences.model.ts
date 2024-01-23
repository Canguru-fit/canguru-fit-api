import { Schema, InferSchemaType, model } from 'mongoose';

const diligence = new Schema(
  {
    status: {
      type: String,
      enum: ['NEW', 'IN PROGRESS', 'COMPLETED'],
    },
    name: String,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    type: String,
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
