const jwt = require('jsonwebtoken');
const User = require('../models/User');
const secret = process.env.JWT_SECRET || 'secretkey';

async function auth(req, res, next){
  const header = req.headers.authorization;
  if(!header) return res.status(401).json({ error:'Missing auth header' });
  const token = header.split(' ')[1];
  if(!token) return res.status(401).json({ error:'Invalid token' });
  try{
    const payload = jwt.verify(token, secret);
    const user = await User.findById(payload.id);
    if(!user) return res.status(401).json({ error:'User not found' });
    if(user.blocked) return res.status(403).json({ error:'User blocked' });
    req.user = user;
    next();
  }catch(err){
    return res.status(401).json({ error:'Token invalid' });
  }
}

function adminOnly(req, res, next){
  if(!req.user) return res.status(401).json({ error:'Not authenticated' });
  if(req.user.role !== 'admin') return res.status(403).json({ error:'Admin only' });
  next();
}

module.exports = { auth, adminOnly };
