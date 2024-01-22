import { Schema, InferSchemaType, model } from 'mongoose';

const robot = new Schema(
  {
    name: String,
    url: String,
    isAvailable: Boolean,
    mandatoryFields: Array,
    source: String,
  },
  {
    collection: 'Robots',
    timestamps: true,
  }
);

export type Robot = InferSchemaType<typeof robot>;

export default model('robot', robot);
