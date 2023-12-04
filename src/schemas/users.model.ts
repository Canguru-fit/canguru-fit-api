import { Schema, InferSchemaType, model } from 'mongoose';

const user = new Schema(
  {
    email: String,
    name: String,
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'company',
    },
    status: Boolean,
    lastLogin: Date,
    termsAndConditions: Boolean,
  },
  {
    collection: 'Users',
    timestamps: true,
  }
);

export type User = InferSchemaType<typeof user>;

export default model('user', user);
