const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middleware/auth');
const User = require('../models/User');
const Feedback = require('../models/Feedback');
const Course = require('../models/Course');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const mongoose = require('mongoose');

// Basic dashboard stats
router.get('/stats', auth, adminOnly, async (req,res)=>{
  const totalFeedback = await Feedback.countDocuments();
  const totalStudents = await User.countDocuments({ role:'student' });
  const avgRatings = await Feedback.aggregate([
    { $group: { _id: "$course", avgRating: { $avg: "$rating" }, count: { $sum:1 } } }
  ]);
  const courses = await Course.find();
  // map course ids to titles
  const courseMap = {};
  courses.forEach(c=> courseMap[c._id]=c.title);
  const avg = avgRatings.map(a=> ({ course: courseMap[a._id]||String(a._id), avgRating:a.avgRating, count:a.count }));
  res.json({ totalFeedback, totalStudents, averagePerCourse:avg });
});

// manage users
router.get('/students', auth, adminOnly, async (req,res)=>{
  const users = await User.find({ role:'student' }).select('-password');
  res.json(users);
});

router.post('/students/:id/block', auth, adminOnly, async (req,res)=>{
  const u = await User.findById(req.params.id);
  if(!u) return res.status(404).json({ error:'Not found' });
  u.blocked = true;
  await u.save();
  res.json({ ok:true });
});

router.post('/students/:id/unblock', auth, adminOnly, async (req,res)=>{
  const u = await User.findById(req.params.id);
  if(!u) return res.status(404).json({ error:'Not found' });
  u.blocked = false;
  await u.save();
  res.json({ ok:true });
});

router.delete('/students/:id', auth, adminOnly, async (req,res)=>{
  await User.findByIdAndDelete(req.params.id);
  res.json({ ok:true });
});

// export feedback to CSV (filtered optional)
router.get('/export-feedback', auth, adminOnly, async (req,res)=>{
  const q = {};
  if(req.query.course) q.course = mongoose.Types.ObjectId(req.query.course);
  if(req.query.rating) q.rating = parseInt(req.query.rating);
  const rows = await Feedback.find(q).populate('student').populate('course').lean();
  const csvRows = rows.map(r=>({
    studentName: r.student.name,
    studentEmail: r.student.email,
    course: r.course.title,
    rating: r.rating,
    message: r.message,
    createdAt: r.createdAt
  }));
  const filePath = '/tmp/feedback_export.csv';
  const csvWriter = createCsvWriter({ path: filePath, header:[
    {id:'studentName', title:'Student Name'},
    {id:'studentEmail', title:'Student Email'},
    {id:'course', title:'Course'},
    {id:'rating', title:'Rating'},
    {id:'message', title:'Message'},
    {id:'createdAt', title:'Created At'},
  ]});
  await csvWriter.writeRecords(csvRows);
  res.download(filePath, 'feedback_export.csv');
});

module.exports = router;
