import { Schema, InferSchemaType, model } from 'mongoose';

const routines = new Schema(
  {
    name: String,
    type: {
      type: String,
      enum: ['WEEK_DAYS', 'NUMERIC'],
    },
    target: {
      type: String,
      enum: ['HYPERTROPHY', 'FAT_REDUCTION', 'MUSCLE_DEFINITION', 'PHYSICAL_CONDITIONING'],
    },
    level: {
      type: String,
      enum: ['ADAPTATION', 'BEGINNER', 'INTERMEDIARY', 'ADVANCED'],
    },
    start: Date,
    end: Date,
    deleteOnEnd: Boolean,
    showBeforeStart: Boolean,
    instructor: {
      type: Schema.Types.ObjectId,
      ref: 'instructor',
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: 'instructor',
    },
    workout: [
      {
        type: Schema.Types.ObjectId,
        ref: 'workout',
      },
    ],
  },
  {
    collection: 'Routines',
    timestamps: true,
  }
);

export type Routines = InferSchemaType<typeof routines>;

export default model('routines', routines);
