require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const feedbackRoutes = require('./routes/feedback');
const courseRoutes = require('./routes/courses');
const adminRoutes = require('./routes/admin');

const app = express();
app.use(cors());
app.use(express.json());

// serve uploads (avatars) if exist
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 4000;
const MONGO = process.env.MONGO_URI || 'mongodb://mongo:27017/fullstack_db';

mongoose.connect(MONGO, { useNewUrlParser:true, useUnifiedTopology:true })
  .then(()=> {
    console.log('MongoDB connected');
    app.listen(PORT, ()=> console.log('Server listening on', PORT));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
  });
