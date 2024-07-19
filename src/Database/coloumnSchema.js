const mongoose = require('mongoose');
const { Schema } = mongoose;

const columnSchema = new Schema({
  title: { type: String, required: true },
  order: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Column = mongoose.model('Column', columnSchema);
module.exports = Column;
