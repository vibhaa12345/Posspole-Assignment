import React, { useEffect, useState } from 'react';
import API, { setToken } from '../api';

export default function Dashboard(){
  const [courses, setCourses] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(()=>{
    const token = localStorage.getItem('token');
    if(token){
      setToken(token);
      try{
        const p = JSON.parse(atob(token.split('.')[1]));
        setIsAdmin(p.role === 'admin');
      }catch(e){}
    }
    // fetch courses
    API.get('/courses').then(r=>setCourses(r.data)).catch(()=>{});
  },[]);
  return (<div className="container">
    <h2>Dashboard</h2>
    <div><a href="/feedback">Submit Feedback</a> | <a href="/profile">Profile</a> {isAdmin && <>| <a href="/admin">Admin</a></>}</div>
    <h3>Courses</h3>
    <ul>{courses.map(c=> <li key={c._id}>{c.title}</li>)}</ul>
  </div>);
}
