import { Schema, InferSchemaType, model } from 'mongoose';

const exercise = new Schema(
  {
    name: String,
    category: String,
    clipUrl: String,
    alternativeExercises: {
      type: Array,
    },
    series: String,
    weight: String,
    interval: Number,
    notes: String,
  },
  {
    collection: 'Exercises',
    timestamps: true,
  }
);

export type Exercise = InferSchemaType<typeof exercise>;

export default model('exercise', exercise);
