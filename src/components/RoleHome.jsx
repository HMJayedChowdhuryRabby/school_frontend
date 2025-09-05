import React from 'react';
import Layout from './Layout';
import AdminDashboard from './AdminDashboard';
import TeacherDashboard from './TeacherDashboard';
import StudentDashboard from './StudentDashboard';
import ParentDashboard from './ParentDashboard';

export default function RoleHome({ role }) {
  return (
    <Layout role={role}>
      <div style={{
        fontSize: 32,
        fontWeight: 700,
        color: '#1976d2',
        marginBottom: 24,
        textAlign: 'center',
        textShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {role} Dashboard
      </div>
      <div style={{
        width: '100%',
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 32
      }}>
        {role === 'Admin' && <AdminDashboard />}
        {role === 'Teacher' && <TeacherDashboard />}
        {role === 'Student' && <StudentDashboard />}
        {role === 'Parent' && <ParentDashboard />}
      </div>
    </Layout>
  );
}
