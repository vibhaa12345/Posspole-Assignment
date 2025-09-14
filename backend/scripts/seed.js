/*
Run with: node scripts/seed.js
Creates an admin user (admin@school.test / Password@123) and some sample courses.
*/
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/Course');
const bcrypt = require('bcryptjs');

async function main(){
  const MONGO = process.env.MONGO_URI || 'mongodb://mongo:27017/fullstack_db';
  await mongoose.connect(MONGO);
  const existing = await User.findOne({ email:'admin@school.test' });
  if(!existing){
    const hashed = await bcrypt.hash('Password@123', 10);
    const admin = new User({ name:'Administrator', email:'admin@school.test', password:hashed, role:'admin' });
    await admin.save();
    console.log('Admin created: admin@school.test / Password@123');
  } else {
    console.log('Admin already exists');
  }
  const courses = ['Mathematics', 'Physics', 'Chemistry', 'Computer Science'];
  for(const title of courses){
    const ex = await Course.findOne({ title });
    if(!ex) await new Course({ title }).save();
  }
  console.log('Sample courses ensured');
  process.exit(0);
}
main().catch(e=>{ console.error(e); process.exit(1); });
