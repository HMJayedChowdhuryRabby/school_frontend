import { Link, useNavigate } from 'react-router-dom';
import React from 'react';

export default function Navbar({ role }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <nav style={{
      background: '#1976d2',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 24px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{ fontWeight: 700, fontSize: 20, letterSpacing: 1 }}>
        School Portal
      </div>
      <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        <Link to="/" style={linkStyle}>Home</Link>
        {role && <Link to={`/${role.toLowerCase()}`} style={linkStyle}>{role}</Link>}
        <span style={{ color: '#ffffff88' }}>|</span>
        <button onClick={handleLogout} style={{
          background: '#e53935',
          padding: '6px 16px',
          borderRadius: 8,
          border: 'none',
          color: 'white',
          fontWeight: 600,
          cursor: 'pointer',
          transition: '0.3s',
        }} onMouseOver={e => e.target.style.background = '#d32f2f'}
           onMouseOut={e => e.target.style.background = '#e53935'}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  fontWeight: 600,
  transition: '0.2s',
  cursor: 'pointer'
};
