import React, { useEffect, useState } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';

export default function AdminDashboard(){
  const [stats, setStats] = useState(null);
  useEffect(()=>{
    API.get('/admin/stats').then(r=>setStats(r.data)).catch(()=>{});
  },[]);
  return (<div className="container">
    <h2>Admin Dashboard</h2>
    <div><Link to="/admin/students">Manage Students</Link> | <a href="/api/admin/export-feedback">Export Feedback CSV</a></div>
    {stats ? (<div>
      <div><b>Total Feedback:</b> {stats.totalFeedback}</div>
      <div><b>Total Students:</b> {stats.totalStudents}</div>
      <h4>Average Ratings per Course</h4>
      <ul>
      {stats.averagePerCourse.map(a => <li key={a.course}>{a.course}: {a.avgRating ? a.avgRating.toFixed(2) : 'N/A'} ({a.count})</li>)}
      </ul>
    </div>) : <div>Loading...</div>}
  </div>);
}
