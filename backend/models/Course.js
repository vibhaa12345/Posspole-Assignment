const mongoose = require('mongoose');
const courseSchema = new mongoose.Schema({
  title: { type:String, required:true },
  code: String,
  description: String
}, { timestamps:true });
module.exports = mongoose.model('Course', courseSchema);
