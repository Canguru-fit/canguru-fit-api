import { Schema, InferSchemaType, model } from 'mongoose';

const documentType = new Schema(
  {
    name: String,
    description: String,
    mandatoryFields: Array,
    entity: {
      type: String,
      enum: ['NATURAL PERSON', 'LEGAL PERSON'],
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
