import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const groupSchema = new Schema({
  students: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      username: {
        type: String,
        required: true,
      },
    },
  ],
  groupName: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const group = mongoose.model('Group', groupSchema);

export default group;
