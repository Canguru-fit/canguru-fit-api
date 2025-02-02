import { Schema, InferSchemaType, model } from 'mongoose';

const personal = new Schema(
  {
    email: { type: String, unique: true },
    name: String,
    cref: String,
    phone: String,
    gender: { type: String, enum: ['', 'Male', 'Female'] },
    dateOfBirth: Date,
    zipCode: String,
    address: String,
    addressNumber: Number,
    addressComplement: String,
    district: String,
    city: String,
    state: String,
    country: String,
    cognitoId: String,
    status: Boolean,
    lastLogin: Date,
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: 'student',
      },
    ],
    workouts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'workouts',
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
    collection: 'Personals',
    timestamps: true,
  }
);

personal.index({ cognitoId: 1 });
personal.index({ studentes: 1 });

export type Personal = InferSchemaType<typeof personal>;

export default model('personal', personal);
