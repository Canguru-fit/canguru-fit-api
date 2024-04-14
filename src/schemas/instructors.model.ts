import { Schema, InferSchemaType, model } from 'mongoose';

const instructor = new Schema(
  {
    email: String,
    name: String,
    cref: String,
    phone: String,
    gender: String,
    status: Boolean,
    lastLogin: Date,
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: 'student',
      },
    ],
    routines: [
      {
        type: Schema.Types.ObjectId,
        ref: 'routine',
      },
    ],
  },
  {
    collection: 'Instructors',
    timestamps: true,
  }
);

export type Instructor = InferSchemaType<typeof instructor>;

export default model('instructor', instructor);
