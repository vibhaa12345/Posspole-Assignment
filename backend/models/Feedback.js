const mongoose = require('mongoose');
const feedbackSchema = new mongoose.Schema({
  student: { type:mongoose.Schema.Types.ObjectId, ref:'User', required:true },
  course: { type:mongoose.Schema.Types.ObjectId, ref:'Course', required:true },
  rating: { type:Number, min:1, max:5, required:true },
  message: String
}, { timestamps:true });
module.exports = mongoose.model('Feedback', feedbackSchema);
