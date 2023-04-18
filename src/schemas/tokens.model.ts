import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let tokens = new Schema(
  {
    token: String,
  },
  {
    collection: 'Tokens',
    timestamps: true
  }
);

export default mongoose.model('tokens', tokens);


