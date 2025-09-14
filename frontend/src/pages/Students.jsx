import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Students(){
  const [students, setStudents] = useState([]);
  useEffect(()=>{ API.get('/admin/students').then(r=>setStudents(r.data)).catch(()=>{}); },[]);
  async function block(id){ await API.post('/admin/students/'+id+'/block'); setStudents(s => s.map(u=> u._id===id? {...u, blocked:true}:u)); }
  async function unblock(id){ await API.post('/admin/students/'+id+'/unblock'); setStudents(s => s.map(u=> u._id===id? {...u, blocked:false}:u)); }
  async function remove(id){ if(!confirm('Delete user?')) return; await API.delete('/admin/students/'+id); setStudents(s => s.filter(u=> u._id!==id)); }
  return (<div className="container">
    <h2>Students</h2>
    <table style={{width:'100%'}} border="1">
      <thead><tr><th>Name</th><th>Email</th><th>Blocked</th><th>Actions</th></tr></thead>
      <tbody>
        {students.map(u=> <tr key={u._id}>
          <td>{u.name}</td><td>{u.email}</td><td>{u.blocked? 'Yes':'No'}</td>
          <td>
            {!u.blocked ? <button onClick={()=>block(u._id)}>Block</button> : <button onClick={()=>unblock(u._id)}>Unblock</button>}
            <button onClick={()=>remove(u._id)}>Delete</button>
          </td>
        </tr>)}
      </tbody>
    </table>
  </div>);
}
