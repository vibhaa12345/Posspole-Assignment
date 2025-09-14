import React, { useEffect, useState } from 'react';
import API, { setToken } from '../api';

export default function Profile(){
  const [profile,setProfile] = useState({ name:'', email:'', phone:'', dob:'', address:'', avatarUrl:'' });
  const [msg,setMsg] = useState('');
  useEffect(()=>{
    const token = localStorage.getItem('token');
    if(token) setToken(token);
    API.get('/auth/me').then(r=> setProfile(r.data)).catch(()=>{});
  },[]);
  async function save(e){
    e.preventDefault();
    try{
      await API.put('/auth/me', { name:profile.name, phone:profile.phone, dob:profile.dob, address:profile.address });
      setMsg('Saved');
    }catch(e){ setMsg(e.response?.data?.error || e.message); }
  }
  async function changePassword(e){
    e.preventDefault();
    const current = prompt('Enter current password');
    const next = prompt('Enter new password (min 8 chars, 1 number, 1 special)');
    if(!current || !next) return;
    try{
      await API.post('/auth/change-password', { currentPassword: current, newPassword: next });
      alert('Password changed');
    }catch(e){ alert(e.response?.data?.error || e.message); }
  }
  async function uploadAvatar(e){
    const file = e.target.files[0];
    if(!file) return;
    const fd = new FormData();
    fd.append('avatar', file);
    try{
      const res = await API.post('/auth/upload-avatar', fd, { headers: {'Content-Type':'multipart/form-data'} });
      setProfile(p => ({...p, avatarUrl: res.data.avatarUrl}));
    }catch(e){ alert(e.response?.data?.error || e.message); }
  }
  return (<div className="container">
    <h2>Profile</h2>
    {profile.avatarUrl && <img src={profile.avatarUrl} alt="avatar" style={{width:120, height:120, objectFit:'cover'}} />}
    <div>
      <input value={profile.name||''} onChange={e=>setProfile({...profile, name: e.target.value})} placeholder="Name" />
      <input value={profile.email||''} readOnly />
      <input value={profile.phone||''} onChange={e=>setProfile({...profile, phone: e.target.value})} placeholder="Phone" />
      <input value={profile.dob? profile.dob.split('T')[0] : ''} onChange={e=>setProfile({...profile, dob: e.target.value})} type="date" />
      <textarea value={profile.address||''} onChange={e=>setProfile({...profile, address: e.target.value})} placeholder="Address" />
      <div>
        <label>Avatar: <input type="file" onChange={uploadAvatar} /></label>
      </div>
      <button onClick={save}>Save Profile</button>
      <button onClick={changePassword}>Change Password</button>
    </div>
    {msg && <div>{msg}</div>}
  </div>);
}
