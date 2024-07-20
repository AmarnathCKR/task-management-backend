const mongoose = require('mongoose');
const { Schema } = mongoose;


const taskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  column: { type: Schema.Types.ObjectId, ref: 'Column', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  dueDate: { type: Date },
  completed: { type: Boolean, default: false }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
