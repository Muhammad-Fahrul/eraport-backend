import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const collabSchema = new Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const collab = mongoose.model('Collab', collabSchema);

export default collab;
