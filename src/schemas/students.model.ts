import { Schema, InferSchemaType, model } from 'mongoose';

const student = new Schema(
  {
    name: String,
    email: String,
    phone: String,
    gender: String,
    group: {
      type: String,
      enum: ['ONLINE', 'PRESENCE'],
    },
    birthDate: Date,
    streetName: String,
    streetNumber: Number,
    streetComplement: String,
    disctrict: String,
    city: String,
    country: String,
    zipcode: String,
    instructor: {
      type: Schema.Types.ObjectId,
      ref: 'instructor',
    },
    routines: [
      {
        type: Schema.Types.ObjectId,
        ref: 'routine',
      },
    ],
  },
  {
    collection: 'Students',
    timestamps: true,
  }
);

export type Student = InferSchemaType<typeof student>;

export default model('student', student);
