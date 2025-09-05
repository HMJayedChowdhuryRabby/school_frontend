import React, { useState, useEffect } from 'react';
import axios from 'axios';

const roles = ['Headmaster', 'Founder', 'Chairman'];

export default function AdminAdministration() {
  const [profiles, setProfiles] = useState([]);
  const [form, setForm] = useState({ role: '', name: '', message: '', image: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProfiles = async () => {
    try {
      const res = await axios.get('/api/admin-profiles');
      setProfiles(res.data);
    } catch {
      setProfiles([]);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleChange = e => {
    const { name, value, files } = e.target;
    setForm(f => ({ ...f, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.role || !form.name || !form.message || !form.image) return;
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('role', form.role);
      formData.append('name', form.name);
      formData.append('message', form.message);
      formData.append('image', form.image);
      await axios.post('/api/admin-profiles/upload', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setForm({ role: '', name: '', message: '', image: null });
      fetchProfiles();
    } catch {
      setError('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this profile?')) return;
    setLoading(true);
    setError('');
    try {
      await axios.delete(`/api/admin-profiles/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      fetchProfiles();
    } catch {
      setError('Delete failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 16 }}>Manage Administration Profiles</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <select name="role" value={form.role} onChange={handleChange} style={{ marginRight: 12 }}>
          <option value="">Select Role</option>
          {roles.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" style={{ marginRight: 12 }} />
  <textarea name="message" value={form.message} onChange={handleChange} placeholder="Message" rows={8} style={{ marginRight: 12, minWidth: 220, minHeight: 120, resize: 'vertical', fontSize: 16 }} />
        <input type="file" name="image" accept="image/*" onChange={handleChange} style={{ marginRight: 12 }} />
        <button type="submit" disabled={loading || !form.role || !form.name || !form.message || !form.image} style={{ padding: '8px 18px', borderRadius: 8, background: '#000', color: '#fff', fontWeight: 600, border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {profiles.map(profile => (
          <div key={profile._id} style={{ position: 'relative', width: 220, borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px #ccc', padding: 12, background: '#fff' }}>
            <img src={profile.photoUrl} alt={profile.name} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8 }} />
            <div style={{ fontWeight: 700, fontSize: 20, marginTop: 8 }}>{profile.name}</div>
            <div style={{ fontWeight: 500, fontSize: 15, color: '#1976d2', marginBottom: 8 }}>{profile.role}</div>
            <div style={{ fontSize: 22, marginTop: 12, color: '#000', whiteSpace: 'pre-line', wordBreak: 'break-word', fontWeight: 400, lineHeight: 1.6 }}>{profile.message}</div>
            <button onClick={() => handleDelete(profile._id)} style={{ position: 'absolute', top: 6, right: 6, background: '#e55353', color: '#000', border: 'none', borderRadius: 6, padding: '2px 8px', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
