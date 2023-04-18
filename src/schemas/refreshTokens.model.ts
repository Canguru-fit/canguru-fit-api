import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let refreshTokens = new Schema(
  {
    token: String
  },
  { collection: 'RefreshTokens' }
);

export default mongoose.model('refreshTokens', refreshTokens);


