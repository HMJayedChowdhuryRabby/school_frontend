import React, { useState, useRef } from 'react';
import { Typography, Button, Box, Avatar, Grid, Card, CardContent } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import ArticleIcon from '@mui/icons-material/Article';
import PeopleIcon from '@mui/icons-material/People';
import ClassIcon from '@mui/icons-material/Class';
import BookIcon from '@mui/icons-material/Book';
import GradeIcon from '@mui/icons-material/Grade';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

// Import management components
import AdminNoticeManagement from './AdminNoticeManagement';
import AdminUserManagement from './AdminUserManagement';
import AdminClassManagement from './AdminClassManagement';
import AdminSubjectManagement from './AdminSubjectManagement';
import AdminStudentManagement from './AdminStudentManagement';
import AdminTeacherManagement from './AdminTeacherManagement';
import AdminAttendanceManagement from './AdminAttendanceManagement';
import AdminExamManagement from './AdminExamManagement';
import AdminGradeManagement from './AdminGradeManagement';
import AdminFeeManagement from './AdminFeeManagement';
import AdminGallery from './AdminGallery';
import AdminAdministration from './AdminAdministration';
import AdminBannerManager from './AdminBannerManager';

export default function AdminDashboard() {
  const [activeModule, setActiveModule] = useState('');

  // Refs for scrolling
  const homeRef = useRef(null);
  const studentRef = useRef(null);
  const adminRef = useRef(null);


  const modules = [
    { name: 'Notices', icon: <ArticleIcon fontSize="large" />, component: <AdminNoticeManagement />, color: '#4fc3f7' },
    { name: 'Users', icon: <PeopleIcon fontSize="large" />, component: <AdminUserManagement />, color: '#81c784' },
    { name: 'Classes', icon: <ClassIcon fontSize="large" />, component: <AdminClassManagement />, color: '#ffd54f' },
    { name: 'Subjects', icon: <BookIcon fontSize="large" />, component: <AdminSubjectManagement />, color: '#ba68c8' },
    { name: 'Students', icon: <PeopleIcon fontSize="large" />, component: <AdminStudentManagement />, color: '#f06292', ref: studentRef },
    { name: 'Teachers', icon: <PeopleIcon fontSize="large" />, component: <AdminTeacherManagement />, color: '#4db6ac' },
    { name: 'Attendance', icon: <GradeIcon fontSize="large" />, component: <AdminAttendanceManagement />, color: '#ff8a65' },
    { name: 'Exams', icon: <GradeIcon fontSize="large" />, component: <AdminExamManagement />, color: '#9575cd' },
    { name: 'Grades', icon: <GradeIcon fontSize="large" />, component: <AdminGradeManagement />, color: '#64b5f6' },
    { name: 'Fees', icon: <AttachMoneyIcon fontSize="large" />, component: <AdminFeeManagement />, color: '#fbc02d' },
  { name: 'Gallery', icon: <PhotoLibraryIcon fontSize="large" />, component: <AdminGallery />, color: '#e57373' },
  { name: 'Banner Images', icon: <PhotoLibraryIcon fontSize="large" />, component: <AdminBannerManager />, color: '#90caf9' },
    { name: 'Administration', icon: <AdminPanelSettingsIcon fontSize="large" />, component: <AdminAdministration />, color: '#7986cb', ref: adminRef },
  ];

  return (
    <div ref={homeRef}>
      {/* Header */}


      {/* Dashboard Cards */}
      <Box sx={{ p: 4 }}>
        <Grid container spacing={3}>
          {modules.map((mod) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={mod.name}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: '0.3s',
                  '&:hover': { transform: 'scale(1.05)', cursor: 'pointer' }
                }}
                onClick={() => setActiveModule(activeModule === mod.name ? '' : mod.name)}
              >
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ color: mod.color }}>{mod.icon}</Box>
                  <Typography variant="h6" fontWeight="bold">{mod.name}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Render active module below cards */}
        <Box sx={{ mt: 4 }}>
          {modules.map(mod => activeModule === mod.name && (
            <Box key={mod.name} ref={mod.ref ? mod.ref : null} sx={{ p: 3, backgroundColor: '#f5f7fa', borderRadius: 3, boxShadow: 2 }}>
              {mod.component}
            </Box>
          ))}
        </Box>
      </Box>
    </div>
  );
}
