import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import FeedbackForm from './pages/FeedbackForm';
import AdminDashboard from './pages/AdminDashboard';
import Students from './pages/Students';
import './styles.css';

function App(){
  return (
    <BrowserRouter>
      <div className="nav"><Link to='/'>Home</Link> | <Link to='/login'>Login</Link> | <Link to='/signup'>Signup</Link> | <Link to='/dashboard'>Dashboard</Link></div>
      <Routes>
        <Route path="/" element={<div style={{padding:20}}>Welcome to Feedback App</div>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/feedback" element={<FeedbackForm/>} />
        <Route path="/admin" element={<AdminDashboard/>} />
        <Route path="/admin/students" element={<Students/>} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(<App />);
