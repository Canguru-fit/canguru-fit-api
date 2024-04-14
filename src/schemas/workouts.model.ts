import { Schema, InferSchemaType, model } from 'mongoose';

const workout = new Schema(
  {
    type: String,
    order: String,
    notes: String,
    routine: {
      type: Schema.Types.ObjectId,
      ref: 'routine',
    },
    exercises: [
      {
        type: Schema.Types.ObjectId,
        ref: 'exercise',
      },
    ],
  },
  {
    collection: 'Workouts',
    timestamps: true,
  }
);

export type Workout = InferSchemaType<typeof workout>;

export default model('workout', workout);
