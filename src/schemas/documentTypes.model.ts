import { Schema, InferSchemaType, model } from 'mongoose';
import { entitiesTypes } from './schema.utils';

const documentType = new Schema(
  {
    name: String,
    description: String,
    entityType: {
      type: String,
      enum: entitiesTypes,
    },
    robot: {
      type: Schema.Types.ObjectId,
      ref: 'robot',
    },
  },
  {
    collection: 'DocumentTypes',
    timestamps: true,
  }
);

export type DocumentType = InferSchemaType<typeof documentType>;

export default model('documentType', documentType);
