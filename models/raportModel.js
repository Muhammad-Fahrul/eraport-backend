import mongoose from 'mongoose';
import InvariantError from '../error/InvariantError.js';
const Schema = mongoose.Schema;

const raport = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  valid: {
    type: Boolean,
    default: false,
  },
  status: {
    type: Boolean,
    default: true,
  },
  columns: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Column', // Mengacu pada model RaportInput
      },
    ],
    default: [],
  },
});

// Validasi custom untuk memastikan jumlah item dalam koleksi tidak melebihi batas
raport.pre('save', function (next) {
  const columnsCount = this.columns.length;
  if (columnsCount >= 7) {
    const err = new InvariantError(
      'Batas jumlah input dalam koleksi Raport telah tercapai'
    );
    next(err);
  } else {
    next();
  }
});

const Raport = mongoose.model('Raport', raport);
export default Raport;
