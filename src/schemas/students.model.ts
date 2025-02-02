import { Schema, InferSchemaType, model } from 'mongoose';

const student = new Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    phone: String,
    gender: { type: String, enum: ['', 'Male', 'Female'] },
    group: {
      type: String,
      enum: ['ONLINE', 'PRESENCE'],
    },
    birthDate: Date,
    address: String,
    addressNumber: Number,
    addressComplement: String,
    disctrict: String,
    city: String,
    state: String,
    country: String,
    zipcode: String,
    cognitoId: String,
    personals: [
      {
        type: Schema.Types.ObjectId,
        ref: 'personals',
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
    collection: 'Students',
    timestamps: true,
  }
);

student.index({ personals: 1, name: 1 });
student.index({ cognitoId: 1 });

export type Student = InferSchemaType<typeof student>;

export default model('student', student);
