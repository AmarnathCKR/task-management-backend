const mongoose = require('mongoose');
const { Schema } = mongoose;

const columnSchema = new Schema({
  name: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Column = mongoose.model('Column', columnSchema);
module.exports = Column;
