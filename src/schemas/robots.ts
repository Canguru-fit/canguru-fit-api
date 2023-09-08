import { Schema, InferSchemaType, model } from 'mongoose';

let robot = new Schema(
  {
    name: String,
    url: String,
    isAvailable: Boolean,
  },
  {
    collection: 'DocumentTypes',
    timestamps: true
  }
);

export type Robot = InferSchemaType<typeof robot>;

export default model('documentType', robot);


