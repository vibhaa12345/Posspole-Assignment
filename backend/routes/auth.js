const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const secret = process.env.JWT_SECRET || 'secretkey';

function validateEmail(email){
  return /\S+@\S+\.\S+/.test(email);
}
function validatePassword(p){
  return p.length >=8 && /[0-9]/.test(p) && /[^A-Za-z0-9]/.test(p);
}

function makeToken(user){
  return jwt.sign({ id:user._id, role:user.role, name:user.name, email:user.email }, secret, { expiresIn:'7d' });
}

// Signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if(!name || !email || !password) return res.status(400).json({ error:'Missing fields' });
  if(!validateEmail(email)) return res.status(400).json({ error:'Invalid email' });
  if(!validatePassword(password)) return res.status(400).json({ error:'Weak password' });
  try{
    const existing = await User.findOne({ email });
    if(existing) return res.status(400).json({ error:'Email in use' });
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password:hashed });
    await user.save();
    const token = makeToken(user);
    res.json({ token, user:{ id:user._id, name:user.name, email:user.email, role:user.role } });
  }catch(e){
    res.status(500).json({ error:e.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if(!email || !password) return res.status(400).json({ error:'Missing fields' });
  try{
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ error:'Invalid creds' });
    const ok = await bcrypt.compare(password, user.password);
    if(!ok) return res.status(400).json({ error:'Invalid creds' });
    const token = makeToken(user);
    res.json({ token, user:{ id:user._id, name:user.name, email:user.email, role:user.role } });
  }catch(e){
    res.status(500).json({ error:e.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  const u = req.user.toObject();
  delete u.password;
  res.json(u);
});

// Update profile (name, phone, dob, address) - email read-only
router.put('/me', auth, async (req, res) => {
  const { name, phone, dob, address } = req.body;
  const u = req.user;
  u.name = name ?? u.name;
  u.phone = phone ?? u.phone;
  u.dob = dob ?? u.dob;
  u.address = address ?? u.address;
  await u.save();
  res.json({ ok:true, user: { id:u._id, name:u.name, email:u.email } });
});

// Change password
router.post('/change-password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if(!currentPassword || !newPassword) return res.status(400).json({ error:'Missing fields' });
  if(!validatePassword(newPassword)) return res.status(400).json({ error:'Weak new password' });
  const ok = await bcrypt.compare(currentPassword, req.user.password);
  if(!ok) return res.status(400).json({ error:'Current password incorrect' });
  req.user.password = await bcrypt.hash(newPassword, 10);
  await req.user.save();
  res.json({ ok:true });
});

// Avatar upload (stores in backend/uploads or if CLOUDINARY_URL provided you can extend)
const uploadDir = path.join(__dirname, '..', 'uploads');
if(!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive:true });
const storage = multer.diskStorage({
  destination: function(req,file,cb){ cb(null, uploadDir); },
  filename: function(req,file,cb){
    const ext = path.extname(file.originalname);
    cb(null, req.user._id.toString() + '_' + Date.now() + ext);
  }
});
const upload = multer({ storage });

router.post('/upload-avatar', auth, upload.single('avatar'), async (req, res) => {
  if(!req.file) return res.status(400).json({ error:'No file' });
  // save URL path
  req.user.avatarUrl = '/uploads/' + req.file.filename;
  await req.user.save();
  res.json({ ok:true, avatarUrl: req.user.avatarUrl });
});

module.exports = router;
