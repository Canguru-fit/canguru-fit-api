import { Schema, InferSchemaType, model } from 'mongoose';

let documentType = new Schema(
  {
    name: String,
    description: String,
    mandatoryFields: Array,
    entity: {
      type: String,
      enum: ['NATURAL PERSON', 'LEGAL PERSON']
    },
    robot : {
      type: Schema.Types.ObjectId,
      ref: 'robot'
    },
    naturalPersons : [{
      type: Schema.Types.ObjectId,
      ref: 'naturalPerson'
    }],
    legalPersons : [{
      type: Schema.Types.ObjectId,
      ref: 'legalPerson'
    }]
  },
  {
    collection: 'DocumentTypes',
    timestamps: true
  }
);

export type DocumentType = InferSchemaType<typeof documentType>;

export default model('documentType', documentType);


