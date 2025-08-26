import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const allowedColumnTypes = ['string', 'number', 'boolean', 'array'];

// Buat schema untuk subdocument inputs
const column = new Schema({
  columnType: {
    type: String,
    enum: allowedColumnTypes, // Memastikan bahwa columnType hanya bisa di antara string, number, atau boolean
    required: true,
  },
  columnName: {
    type: String,
    required: true,
  },
  trueValue: {
    type: String,
    required: function () {
      return this.columnType === 'boolean';
    },
  },
  falseValue: {
    type: String,
    required: function () {
      return this.columnType === 'boolean';
    },
  },
  arrayValues: {
    type: [String],
    required: function () {
      return this.columnType === 'array';
    },
    default: [],
  },
  raportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Raport', // Mengacu pada model RaportForm
  },
});

// Custom validation to ensure trueValue and falseValue are only present for boolean columnType
column.path('trueValue').validate(function (value) {
  return (
    this.columnType !== 'boolean' || (value !== undefined && value !== null)
  );
}, 'trueValue is required for boolean columnType');

column.path('falseValue').validate(function (value) {
  return (
    this.columnType !== 'boolean' || (value !== undefined && value !== null)
  );
}, 'falseValue is required for boolean columnType');

// Custom validation to ensure arrayValues are only present for array columnType
column.path('arrayValues').validate(function (value) {
  return (
    this.columnType !== 'array' || (Array.isArray(value) && value.length > 0)
  );
}, 'arrayValues is required for array columnType and should not be empty');

const Column = mongoose.model('Column', column);
export default Column;
