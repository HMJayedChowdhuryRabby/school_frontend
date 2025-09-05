import React from 'react';
import Navbar from './Navbar';

export default function Layout({ children, role }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e0f7fa 0%, #e1bee7 100%)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Navbar role={role} />
      <main style={{
        flex: 1,
        maxWidth: 1200,
        margin: '32px auto',
        padding: '32px 24px',
        background: '#ffffff',
        borderRadius: 20,
        boxShadow: '0 8px 40px rgba(0, 0, 0, 0.08)'
      }}>
        {children}
      </main>
      <footer style={{
        textAlign: 'center',
        padding: '16px 0',
        color: '#555',
        fontSize: 14
      }}>
        &copy; {new Date().getFullYear()} School Portal
      </footer>
    </div>
  );
}
