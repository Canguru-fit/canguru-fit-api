import { Schema, InferSchemaType, model } from 'mongoose';

let naturalPersonDoc = new Schema(
  {
    name: String,
    filePath: String,
    protocol: String,
    collectionStatus: String,
    diligence: {
      type: Schema.Types.ObjectId,
      ref: 'diligence'
    },
    naturalPerson: {
      type: Schema.Types.ObjectId,
      ref: 'naturalPerson'
    },
  },
  {
    collection: 'NaturalPersonDocs',
    timestamps: true
  }
);

export type NaturalPersonDoc = InferSchemaType<typeof naturalPersonDoc>;

export default model('naturalPersonDoc', naturalPersonDoc);


