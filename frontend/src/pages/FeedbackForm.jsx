import React, { useEffect, useState } from 'react';
import API, { setToken } from '../api';
export default function FeedbackForm(){
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ courseId:'', rating:5, message:'' });
  const [msg, setMsg] = useState('');
  useEffect(()=>{ API.get('/courses').then(r=>setCourses(r.data)).catch(()=>{}); },[]);
  useEffect(()=>{ const t=localStorage.getItem('token'); if(t) setToken(t); },[]);
  async function submit(e){
    e.preventDefault();
    try{
      await API.post('/feedback', { courseId:form.courseId, rating:form.rating, message:form.message });
      setMsg('Submitted!');
    }catch(e){ setMsg(e.response?.data?.error||e.message); }
  }
  return (<div className="container">
    <h2>Submit Feedback</h2>
    {msg && <div>{msg}</div>}
    <form onSubmit={submit}>
      <select value={form.courseId} onChange={e=>setForm({...form, courseId:e.target.value})}>
        <option value="">Select course</option>
        {courses.map(c=> <option key={c._id} value={c._id}>{c.title}</option>)}
      </select>
      <select value={form.rating} onChange={e=>setForm({...form, rating:parseInt(e.target.value)})}>
        {[5,4,3,2,1].map(n => <option key={n} value={n}>{n}</option>)}
      </select>
      <textarea placeholder="Message" value={form.message} onChange={e=>setForm({...form, message:e.target.value})} />
      <button>Send</button>
    </form>
  </div>);
}
