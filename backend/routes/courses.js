const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { auth, adminOnly } = require('../middleware/auth');

// Public: list courses
router.get('/', async (req,res)=>{
  const courses = await Course.find().sort({title:1});
  res.json(courses);
});

// Admin create/edit/delete
router.post('/', auth, adminOnly, async (req,res)=>{
  const { title, code, description } = req.body;
  if(!title) return res.status(400).json({ error:'Missing title' });
  const c = new Course({ title, code, description });
  await c.save();
  res.json(c);
});

router.put('/:id', auth, adminOnly, async (req,res)=>{
  const c = await Course.findById(req.params.id);
  if(!c) return res.status(404).json({ error:'Not found' });
  c.title = req.body.title ?? c.title;
  c.code = req.body.code ?? c.code;
  c.description = req.body.description ?? c.description;
  await c.save();
  res.json(c);
});

router.delete('/:id', auth, adminOnly, async (req,res)=>{
  await Course.findByIdAndDelete(req.params.id);
  res.json({ ok:true });
});

module.exports = router;
