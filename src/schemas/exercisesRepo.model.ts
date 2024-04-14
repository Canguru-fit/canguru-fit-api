import { Schema, InferSchemaType, model } from 'mongoose';

const exercisesRepo = new Schema(
  {
    name: String,
    category: String,
    clipUrl: String,
  },
  {
    collection: 'ExercisesRepo',
    timestamps: true,
  }
);

export type ExercisesRepo = InferSchemaType<typeof exercisesRepo>;

export default model('company', exercisesRepo);
