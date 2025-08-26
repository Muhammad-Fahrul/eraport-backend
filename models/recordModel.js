import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const record = new Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    raportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Raport',
      required: true,
    },
    fields: {
      type: Map,
      of: new Schema({
        value: Schema.Types.Mixed,
        columnType: String,
      }),
    },
  },
  { timestamps: true }
);

const Record = mongoose.model('Record', record);

export default Record;
