import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let hooks = new Schema(
  {
    name: {
      type: String,
      uppercase: true,
      enum : ['BOOKINGS','PROPERTIES'],
      default: 'BOOKINGS'
    },
    url: String,
    requestType: {
      type: String,
      uppercase: false,
    }
  },
  { collection: 'Hooks' }
);

export default mongoose.model('hooks', hooks);


