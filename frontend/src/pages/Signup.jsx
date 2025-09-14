import React, { useState } from 'react';
import API, { setToken } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Signup(){
  const [form,setForm] = useState({ name:'', email:'', password:'' });
  const [err,setErr] = useState('');
  const nav = useNavigate();
  async function submit(e){
    e.preventDefault();
    try{
      const res = await API.post('/auth/signup', form);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      nav('/dashboard');
    }catch(e){
      setErr(e.response?.data?.error || e.message);
    }
  }
  return (<div className="container">
    <h2>Signup</h2>
    {err && <div style={{color:'red'}}>{err}</div>}
    <form onSubmit={submit}>
      <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
      <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
      <input placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} type="password" />
      <button>Signup</button>
    </form>
  </div>);
}
