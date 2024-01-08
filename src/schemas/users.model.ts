import { Schema, InferSchemaType, model } from 'mongoose';

const user = new Schema(
  {
    email: String,
    name: String,
    company: {
      type: Schema.Types.ObjectId,
      ref: 'company',
    },
    status: Boolean,
    lastLogin: Date,
  },
  {
    collection: 'Users',
    timestamps: true,
  }
);

export type User = InferSchemaType<typeof user>;

export default model('user', user);
