const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Feedback = require('../models/Feedback');
const Course = require('../models/Course');

// Submit feedback
router.post('/', auth, async (req, res) => {
  const { courseId, rating, message } = req.body;
  if(!courseId || !rating) return res.status(400).json({ error:'Missing fields' });
  try{
    const course = await Course.findById(courseId);
    if(!course) return res.status(400).json({ error:'Course not found' });
    const fb = new Feedback({ student:req.user._id, course:course._id, rating, message });
    await fb.save();
    res.json(fb);
  }catch(e){ res.status(500).json({ error:e.message }); }
});

// Get my feedbacks (paginated)
router.get('/me', auth, async (req, res) => {
  const page = parseInt(req.query.page||'1');
  const limit = 10;
  const skip = (page-1)*limit;
  const total = await Feedback.countDocuments({ student:req.user._id });
  const items = await Feedback.find({ student:req.user._id }).populate('course').sort({createdAt:-1}).skip(skip).limit(limit);
  res.json({ total, page, items });
});

// Edit or delete require ownership
router.put('/:id', auth, async (req,res)=>{
  try{
    const fb = await Feedback.findById(req.params.id);
    if(!fb) return res.status(404).json({ error:'Not found' });
    if(!fb.student.equals(req.user._id)) return res.status(403).json({ error:'Forbidden' });
    fb.rating = req.body.rating ?? fb.rating;
    fb.message = req.body.message ?? fb.message;
    await fb.save();
    res.json(fb);
  }catch(e){ res.status(500).json({ error:e.message }); }
});

router.delete('/:id', auth, async (req,res)=>{
  try{
    const fb = await Feedback.findById(req.params.id);
    if(!fb) return res.status(404).json({ error:'Not found' });
    if(!fb.student.equals(req.user._id)) return res.status(403).json({ error:'Forbidden' });
    await fb.remove();
    res.json({ ok:true });
  }catch(e){ res.status(500).json({ error:e.message }); }
});

module.exports = router;
