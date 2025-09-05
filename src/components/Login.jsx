import React, { useState } from 'react';
import axios from '../api/axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('role', res.data.user.role);
      switch (res.data.user.role) {
        case 'Admin':
          window.location.href = '/admin';
          break;
        case 'Teacher':
          window.location.href = '/teacher';
          break;
        case 'Student':
          window.location.href = '/student';
          break;
        case 'Parent':
          window.location.href = '/parent';
          break;
        default:
          window.location.href = '/';
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
  background: 'linear-gradient(135deg, #e3f2fd 0%, #90caf9 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
    }}>
      <div
        style={{
          maxWidth: 400,
          width: '100%',
          background: '#fff',
          borderRadius: 18,
          boxShadow: '0 6px 32px rgba(25, 118, 210, 0.10)',
          padding: '8vw 6vw',
          margin: '40px 0',
          position: 'relative',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <img
            src="/logo.jpg"
            alt="Logo"
            style={{ height: 36, width: 36, marginBottom: 10, cursor: 'pointer', borderRadius: '50%', boxShadow: '0 2px 8px #c5cae9', objectFit: 'cover' }}
            onClick={() => window.location.href = '/'}
          />
          <h2 style={{ margin: 0, color: '#111', fontWeight: 700, fontSize: 28 }}>Login</h2>
          <p style={{ color: '#111', margin: '8px 0 0 0', fontSize: 16 }}>Access your dashboard</p>
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email" style={{ fontWeight: 600, color: '#111', fontSize: 15, marginBottom: 4, display: 'block' }}>Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: 12, marginBottom: 18, borderRadius: 8, border: '1px solid #bbb', fontSize: 16, background: '#f7fbff', color: '#111' }}
          />
          <label htmlFor="password" style={{ fontWeight: 600, color: '#111', fontSize: 15, marginBottom: 4, display: 'block' }}>Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: 12, marginBottom: 18, borderRadius: 8, border: '1px solid #bbb', fontSize: 16, background: '#f7fbff', color: '#111' }}
          />
          {error && <div style={{ color: '#e55353', marginBottom: 16, textAlign: 'center', fontWeight: 600 }}>{error}</div>}
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: 14, borderRadius: 8, background: '#1976d2', color: '#fff', fontWeight: 700, fontSize: 18, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: 1, marginTop: 4, boxShadow: loading ? '0 0 10px #1976d2' : 'none', transition: 'all 0.3s' }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
